
/**

  Authors: Toni Ruottu, Finland 2010-2018

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import utils from '../utils.js';
import {noConnection} from '../errors.js';

export default class Interval {

  constructor(dwst) {
    this._dwst = dwst;
  }

  commands() {
    return ['interval'];
  }

  usage() {
    return [
      '/interval <interval> [command line...]',
      '/interval',
    ];
  }

  examples() {
    return [
      '/interval 1000',
      '/interval 1000 /binary ${random(10)}',
      '/interval',
    ];
  }

  info() {
    return 'run an other command periodically';
  }

  _run(intervalStr = null, ...commandParts) {
    if (intervalStr === null) {
      if (this._dwst.intervalId === null) {
        this._dwst.terminal.log('no interval to clear', 'error');
      } else {
        clearInterval(this._dwst.intervalId);
        this._dwst.terminal.log('interval cleared', 'system');
      }
      return;
    }
    let count = 0;
    const interval = utils.parseNum(intervalStr);
    const spammer = () => {
      let command;
      let message;
      if (commandParts.length < 1) {
        command = 'send';
        message = String(count);
        count += 1;
      } else {
        const firstPart = commandParts[0];
        if (['/s', '/send', '/b', '/binary'].includes(firstPart) === false) {
          throw 'interval only support send and binary commands'
        }
        command = firstPart.slice(1);
        message = commandParts.slice(1).join(' ');
      }
      if (this._dwst.connection === null || this._dwst.connection.isOpen() === false) {
        if (this._dwst.intervalId !== null) {
          this._dwst.controller.onError(new noConnection(message));
          this._dwst.controller.run('interval');
        }
        return;
      }
      this._dwst.controller.run([command, message].join(' '));
    };
    if (this._dwst.intervalId !== null) {
      this._dwst.terminal.log('clearing old interval', 'system');
      clearInterval(this._dwst.intervalId);
    }
    this._dwst.intervalId = setInterval(spammer, interval);
    this._dwst.terminal.log('interval set', 'system');
  }

  run(paramString) {
    if (paramString.length < 1) {
      this._run();
      return;
    }
    const params = paramString.split(' ');
    this._run(...params);
  }
}
