
/**

  Authors: Toni Ruottu, Finland 2010-2018

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import renderLogEntry from './renderers/log_entry.js';
import renderGfx from './renderers/gfx.js';

export default class Terminal {

  constructor(element, dwst) {
    this._element = element;
    this._dwst = dwst;
    this._limit = 1000;
    this._resizePending = false;
  }

  _hexdump(buffer) {
    function hexify(num) {
      const hex = num.toString(16);
      if (hex.length < 2) {
        return `0${hex}`;
      }
      return hex;
    }
    function charify(num) {
      if (num > 0x7e || num < 0x20) { // non-printable
        return '.';
      }
      return String.fromCharCode(num);
    }
    const dv = new DataView(buffer);
    let offset = 0;
    const lines = [];
    while (offset < buffer.byteLength) {
      let text = '';
      const hexes = [];
      for (let i = 0; i < 16; i++) {
        if (offset < buffer.byteLength) {
          const oneByte = dv.getUint8(offset);
          const asChar = charify(oneByte);
          const asHex = hexify(oneByte);
          text += asChar;
          hexes.push(asHex);
        }
        offset += 1;
      }
      lines.push({
        text,
        hexes,
      });

    }
    return lines;
  }

  isUserScrolling() {
    const errorMargin = 1;
    // Some device pixel ratios create problems when errorMargin < 1.
    // Try to use Windows 10 with 125%, 175% and 225% scaling.
    const screen = document.getElementById('screen1');
    const contentHeight = screen.scrollHeight;
    const visible = screen.offsetHeight;
    const invisible = contentHeight - visible;
    const invisibleAbove = screen.scrollTop;
    const invisibleBelow = invisible - invisibleAbove;
    return invisibleBelow > errorMargin;
  }

  scrollLog() {
    const screen = document.getElementById('screen1');
    screen.scrollTop = screen.scrollHeight;
    this.hideScrollNotification();
  }

  scrollNotificationUpdate() {
    if (this.isUserScrolling()) {
      this.showScrollNotification();
      return;
    }
    this.hideScrollNotification();
  }

  showScrollNotification() {
    [...document.getElementsByClassName('js-scroll-notification')].forEach(sn => {
      sn.removeAttribute('style');
    });
  }

  hideScrollNotification() {
    [...document.getElementsByClassName('js-scroll-notification')].forEach(sn => {
      sn.setAttribute('style', 'display: none;');
    });
  }

  _updateGfxPositions() {
    // Updating gfx positions with this method disables basic centering
    // and aligns the text in the gfx section with the text in log lines.
    const MAX_MAXCHARS = 110;
    Reflect.apply(Array.prototype.forEach, this._element.getElementsByClassName('dwst-gfx'), [maxDiv => {
      const ref = maxDiv.getElementsByClassName('dwst-gfx__line')[0];
      const refTextWidth = ref.offsetWidth;
      const refTextLength = ref.textContent.length;
      const refWidth = refTextWidth / refTextLength;
      const windowWidth = window.innerWidth;
      const maxFit = Math.floor(windowWidth / refWidth);
      let leftMargin = 0;
      if (maxFit < MAX_MAXCHARS) {
        const invisible = MAX_MAXCHARS - maxFit;
        const invisibleLeft = Math.round(invisible / 2);
        leftMargin -= invisibleLeft;
      }
      const field = maxDiv.getElementsByClassName('dwst-gfx__content')[0];
      field.setAttribute('style', `transform: initial; margin-left: ${leftMargin}ch;`);
    }]);
  }

  _addLogItem(logLine) {
    const userWasScrolling = this.isUserScrolling();
    this._element.appendChild(logLine);
    while (this._element.childElementCount > this._limit) {
      this._element.removeChild(this._element.firstChild);
    }
    if (userWasScrolling) {
      return;
    }
    this.scrollLog();
  }

  clearLog() {
    const logClear = document.createElement('div');
    logClear.setAttribute('class', 'dwst-log__clear');
    this._addLogItem(logClear);
  }

  gfx(lines, colors) {
    const gfx = renderGfx(lines, colors);

    const item = document.createElement('div');
    item.setAttribute('class', 'dwst-log__item dwst-log__item--gfx');
    item.appendChild(gfx);

    this._addLogItem(item);
    this._updateGfxPositions();
  }

  mlog(mlogDescription, type) {
    const linkHandlers = {
      onHelpLinkClick: this._dwst.controller.onHelpLinkClick,
      onCommandLinkClick: this._dwst.controller.onCommandLinkClick,
    };

    const logLine = renderLogEntry(mlogDescription, type, linkHandlers);

    const item = document.createElement('div');
    item.setAttribute('class', `dwst-log__item dwst-log__item--${type}`);
    item.appendChild(logLine);

    this._addLogItem(item);
  }

  log(line, type) {
    this.mlog([line], type);
  }

  blog(buffer, type) {
    const msg = `<${buffer.byteLength}B of binary data>`;
    const hd = this._hexdump(buffer);
    const hexLines = hd.map(line => {
      return {
        type: 'hexline',
        text: line.text,
        hexes: line.hexes,
      };
    });
    this.mlog([msg].concat(hexLines), type);
  }

  _throttledUpdateGfxPositions() {
    if (this._resizePending !== true) {
      this._resizePending = true;
      setTimeout(() => {
        this._resizePending = false;
        this._updateGfxPositions();
      }, 100);
    }
  }

  init() {
    window.addEventListener('resize', () => this._throttledUpdateGfxPositions());
    [...document.getElementsByClassName('js-auto-scroll-button')].forEach(asb => {
      asb.addEventListener('click', evt => {
        evt.preventDefault();
        this.scrollLog();
      });
    });
    setInterval(() => this.scrollNotificationUpdate(), 1000);
  }

  onLoad() {
    this._updateGfxPositions();
  }
}
