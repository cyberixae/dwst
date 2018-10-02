
/**

  Authors: Toni Ruottu, Finland 2010-2018

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import utils from '../utils.js';
import {NoConnection, InvalidCombination, NoInterval} from '../errors.js';

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
        throw new NoInterval();
      } else {
        clearInterval(this._dwst.intervalId);
        this._dwst.ui.terminal.log('interval cleared', 'system');
        this._dwst.intervalId = null;
      }
      return;
    }
    const [command, payload] = (() => {
      if (commandParts.length < 1) {
        return ['send', null];
      }
      const firstPart = commandParts[0];
      const otherParts = commandParts.slice(1);
      if (['/s', '/send', '/b', '/binary'].includes(firstPart) === false) {
        throw new InvalidCombination('interval', ['send', 'binary']);
      }
      return [firstPart.slice(1), otherParts.join(' ')];
    })();
    let count = 0;
    const interval = utils.parseNum(intervalStr);
    const spammer = () => {
      const message = (() => {
        if (payload === null) {
          return String(count);
        }
        return payload;
      })();
      if (this._dwst.connection === null || this._dwst.connection.isOpen() === false) {
        if (this._dwst.intervalId !== null) {
          clearInterval(this._dwst.intervalId);
          this._dwst.intervalId = null;
          throw new NoConnection(message);
        }
        return;
      }
      this._dwst.controller.run([command, message].join(' '));
      count += 1;
    };
    if (this._dwst.intervalId !== null) {
      this._dwst.ui.terminal.log('clearing old interval', 'system');
      clearInterval(this._dwst.intervalId);
      this._dwst.intervalId = null;
    }
    this._dwst.intervalId = setInterval(spammer, interval);
    this._dwst.ui.terminal.log('interval set', 'system');
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
