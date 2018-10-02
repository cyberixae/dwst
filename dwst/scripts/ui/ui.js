
/**

  Authors: Toni Ruottu, Finland 2010-2018
           William Orr, US 2012

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import {escapeForParticles} from '../particles.js';

import Terminal from '../terminal.js';
import Clock from './clock.js';
import MenuButton from './menu_button.js';

export default class Ui {

  constructor(element, dwst) {
    this._element = element;
    this._dwst = dwst;
    this.terminal = new Terminal(element.getElementById('ter1'), this._dwst);
    this.clock = new Clock(element.getElementById('clock1'), this._dwst);
    this.menuButton = new MenuButton(element.getElementById('menubut1'), this._dwst);
  }

  enableDebugger() {
    document.documentElement.classList.add('dwst-debug--guides');
  }

  showHelpTip() {
    const helpTip = [
      'type ',
      {
        type: 'command',
        text: '/help',
      },
      ' to list available commands',
    ];
    this.terminal.log(helpTip, 'system');
  }

  send() {
    const raw = document.getElementById('msg1').value;
    document.getElementById('msg1').value = '';
    this._dwst.historyManager.select(raw);
    if (raw === '/idkfa') {
      this.enableDebugger();
      return;
    }
    if (raw.length < 1) {
      this.showHelpTip();
      return;
    }
    if (raw[0] === '/') {
      this._dwst.controller.loud(raw);
      return;
    }
    const text = escapeForParticles(raw);
    const command = `/send ${text}`;
    this._dwst.controller.loud(command);
  }

  globalKeyPress(event) {
    const msg1 = document.getElementById('msg1');
    if (event.key === 'Escape') {
      if (this._dwst.connection !== null && (this._dwst.connection.isOpen() || this._dwst.connection.isConnecting())) {
        this._dwst.controller.loud('/disconnect');
      } else if (msg1.value === '') {
        const connects = this._dwst.historyManager.getConnectCommands(1);
        if (connects.length < 1) {
          msg1.value = `/connect ${this._dwst.ECHO_SERVER_URL}`;
        } else {
          msg1.value = connects[0];
        }
      } else {
        this._dwst.historyManager.select(msg1.value);
        msg1.value = '';
      }
    }
  }

  msgKeyPress(event) {
    const msg1 = document.getElementById('msg1');
    if (event.keyCode === 13) {
      this.send();
    } else if (event.keyCode === 38) { // up
      msg1.value = this._dwst.historyManager.getPrevious(msg1.value);
      return;
    } else if (event.keyCode === 40) { // down
      msg1.value = this._dwst.historyManager.getNext(msg1.value);
      return;
    }
  }

  init() {
    this._element.addEventListener('keydown', evt => this.globalKeyPress(evt));
    this.terminal.init();
    document.getElementById('msg1').addEventListener('keydown', evt => this.msgKeyPress(evt));
    document.getElementById('sendbut1').addEventListener('click', () => this.send());
    this.menuButton.init();
    document.getElementById('msg1').focus();
    this._dwst.controller.silent('/splash');
  }

  onLoad() {
    this.terminal.onLoad();
    this.clock.onLoad();
  }
}
