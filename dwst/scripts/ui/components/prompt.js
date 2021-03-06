
/**

  Authors: Toni Ruottu, Finland 2010-2019
           William Orr, US 2012

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import m from '../../types/m/m.js';

import parser from '../../lib/parser.js';
const {escapeForTemplateExpression} = parser;

export default class Prompt {

  constructor(dwst) {
    this._dwst = dwst;
  }

  init(element) {
    this._element = element;
    this._element.addEventListener('keydown', evt => this._keyHandler(evt));
  }

  _enableDebugger() {
    // TODO: refactor debugger to regular plugin
    document.documentElement.classList.add('dwst-debug--guides');
  }

  send() {
    const raw = this._element.value;
    this._element.value = '';
    this._dwst.model.history.select(raw);
    if (raw === '/idkfa') {
      this._enableDebugger();
      return;
    }
    if (raw.length < 1) {
      this._dwst.ui.terminal.mlog([
        m.line`type ${m.command('/help')} to list available commands`,
      ], 'system');
      return;
    }
    if (raw[0] === '/') {
      this._dwst.controller.prompt.loud(raw);
      return;
    }
    const text = escapeForTemplateExpression(raw);
    const command = `/send ${text}`;
    this._dwst.controller.prompt.loud(command);
  }

  _keyHandler(event) {
    if (event.keyCode === 13) {
      this.send();
    } else if (event.keyCode === 38) { // up
      this._element.value = this._dwst.model.history.getPrevious(this._element.value);
    } else if (event.keyCode === 40) { // down
      this._element.value = this._dwst.model.history.getNext(this._element.value);
    }
  }

  offerConnect() {
    if (this._element.value === '') {
      const connects = this._dwst.model.history.getConnectCommands(1);
      if (connects.length < 1) {
        this._element.value = `/connect ${this._dwst.model.config.echoServer}`;
      } else {
        const [command] = connects;
        this._element.value = command;
      }
    } else {
      this._dwst.model.history.select(this._element.value);
      this._element.value = '';
    }
    this._element.focus();
  }

  focus() {
    this._element.focus();
  }
}
