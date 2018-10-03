
/**

  Authors: Toni Ruottu, Finland 2010-2018

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import Terminal from './components/terminal.js';
import Clock from './components/clock.js';
import Prompt from './components/prompt.js';
import SendButton from './components/send_button.js';
import MenuButton from './components/menu_button.js';
import Screen from './components/screen.js';
import AutoScrollButton from './components/auto_scroll_button.js';
import ScrollNotification from './components/scroll_notification.js';

export default class Ui {

  constructor(element, dwst) {
    this._element = element;
    this._dwst = dwst;
    this._resizePending = false;

    this.terminal = new Terminal(element.getElementById('ter1'), this._dwst);
    this.clock = new Clock(element.getElementById('clock1'), this._dwst);
    this.prompt = new Prompt(element.getElementById('msg1'), this._dwst);
    this.sendButton = new SendButton(element.getElementById('sendbut1'), this._dwst);
    this.menuButton = new MenuButton(element.getElementById('menubut1'), this._dwst);
    this.screen = new Screen(element.getElementById('screen1'), this._dwst);
    this.autoScrollButton = new AutoScrollButton(element.getElementsByClassName('js-auto-scroll-button')[0], this._dwst);
    this.scrollNotification = new ScrollNotification(element.getElementsByClassName('js-scroll-notification')[0], this._dwst);
  }

  globalKeyPress(event) {
    if (event.key === 'Escape') {
      if (this._dwst.connection !== null && (this._dwst.connection.isOpen() || this._dwst.connection.isConnecting())) {
        this._dwst.controller.loud('/disconnect');
      } else {
        this.prompt.offerConnect();
      }
    }
  }

  updateGfxPositions() {
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

  _throttledUpdateGfxPositions() {
    if (this._resizePending !== true) {
      this._resizePending = true;
      setTimeout(() => {
        this._resizePending = false;
        this.updateGfxPositions();
      }, 100);
    }
  }

  init() {
    this._element.addEventListener('keydown', evt => this.globalKeyPress(evt));
    this.prompt.init();
    this.sendButton.init();
    this.menuButton.init();
    this.autoScrollButton.init();
    this.scrollNotification.init();
    this._dwst.controller.silent('/splash');
    this.prompt.focus();
    window.addEventListener('resize', () => this._throttledUpdateGfxPositions());
  }

  onLoad() {
    this.clock.onLoad();
    this.updateGfxPositions();
  }
}
