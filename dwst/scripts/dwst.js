
/**

  Authors: Toni Ruottu, Finland 2010-2018
           William Orr, US 2012

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import config from './config.js';

import {errorHandler, SocketError, UnknownCommand, DwstError} from './errors.js';
import HistoryManager from './history_manager.js';

import Ui from './ui/ui.js';

import Binary from './plugins/binary.js';
import Bins from './plugins/bins.js';
import Clear from './plugins/clear.js';
import Connect from './plugins/connect.js';
import Disconnect from './plugins/disconnect.js';
import Forget from './plugins/forget.js';
import Help from './plugins/help.js';
import Interval from './plugins/interval.js';
import Loadbin from './plugins/loadbin.js';
import Loadtext from './plugins/loadtext.js';
import Reset from './plugins/reset.js';
import Send from './plugins/send.js';
import Spam from './plugins/spam.js';
import Splash from './plugins/splash.js';
import Texts from './plugins/texts.js';

const controller = {

  loud,
  silent,
  run,

  onHelpLinkClick: command => {
    loud(command);
  },

  onCommandLinkClick: command => {
    pluginInterface.historyManager.select(command);
    loud(command);
  },

  onSocketOpen: protocol => {
    const selected = (() => {
      if (protocol.length < 1) {
        return [];
      }
      return [`Selected protocol: ${protocol}`];
    })();
    pluginInterface.ui.terminal.mlog(['Connection established.'].concat(selected), 'system');
    pluginInterface.ui.menuButton.connected(true);
  },

  onSocketClose: (e, sessionLength) => {
    const meanings = {
      1000: 'Normal Closure',
      1001: 'Going Away',
      1002: 'Protocol error',
      1003: 'Unsupported Data',
      1005: 'No Status Rcvd',
      1006: 'Abnormal Closure',
      1007: 'Invalid frame payload data',
      1008: 'Policy Violation',
      1009: 'Message Too Big',
      1010: 'Mandatory Ext.',
      1011: 'Internal Server Error',
      1015: 'TLS handshake',
    };
    const code = (() => {
      if (meanings.hasOwnProperty(e.code)) {
        return `${e.code} (${meanings[e.code]})`;
      }
      return `${e.code}`;
    })();
    const reason = (() => {
      if (e.reason.length < 1) {
        return [];
      }
      return [`Close reason: ${e.reason}`];
    })();
    const sessionLengthString = (() => {
      if (sessionLength === null) {
        return [];
      }
      return [`Session length: ${sessionLength}ms`];
    })();
    pluginInterface.ui.terminal.mlog(['Connection closed.', `Close status: ${code}`].concat(reason).concat(sessionLengthString), 'system');
    pluginInterface.connection = null;
    pluginInterface.ui.menuButton.connected(false);
  },

  onSocketMessage: msg => {
    if (typeof msg === 'string') {
      pluginInterface.ui.terminal.log(msg, 'received');
    } else {
      const fr = new FileReader();
      fr.onload = function (e) {
        const buffer = e.target.result;
        pluginInterface.ui.terminal.blog(buffer, 'received');
      };
      fr.readAsArrayBuffer(msg);
    }
  },

  onSocketError: () => {
    throw new SocketError();
  },

  onSendWhileConnecting: verb => {
    pluginInterface.ui.terminal.log(`Attempting to send data while ${verb}`, 'warning');
  },

};

const pluginInterface = {

  VERSION: config.appVersion,
  ECHO_SERVER_URL: config.echoServer,

  controller,
  historyManager: null,
  connection: null,
  commands: null,
  bins: new Map(),
  texts: new Map(),
  intervalId: null,

};

const plugins = [
  Binary,
  Bins,
  Clear,
  Connect,
  Disconnect,
  Forget,
  Help,
  Interval,
  Loadbin,
  Loadtext,
  Reset,
  Send,
  Spam,
  Splash,
  Texts,
];
pluginInterface.commands = new Map();
for (const Constructor of plugins) {
  const plugin = new Constructor(pluginInterface);
  for (const command of plugin.commands()) {
    pluginInterface.commands.set(command, plugin);
  }
}

function run(command) {
  const [pluginName, ...params] = command.split(' ');
  const paramString = params.join(' ');

  const plugin = pluginInterface.commands.get(pluginName);
  if (typeof plugin === 'undefined') {
    throw new UnknownCommand(pluginName);
  }
  plugin.run(paramString);
}

function silent(line) {
  const noslash = line.substring(1);
  run(noslash);
}

function loud(line) {
  pluginInterface.ui.terminal.log(line, 'command');
  silent(line);
}

function loadSaves() {
  const HISTORY_KEY = 'history';
  const response = localStorage.getItem(HISTORY_KEY);
  const save = function (history) {
    const saveState = JSON.stringify(history);
    localStorage.setItem(HISTORY_KEY, saveState);
  };
  let history = [];
  if (response !== null) {
    history = JSON.parse(response);
  }
  pluginInterface.historyManager = new HistoryManager(history, {save});
}

function init() {
  loadSaves();
  pluginInterface.ui = new Ui(document, pluginInterface);
  // FIXME search and replace
  pluginInterface.terminal = pluginInterface.ui.terminal;
  pluginInterface.ui.init();
}

function onLoad() {
  pluginInterface.ui.onLoad();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service_worker.js');
  }
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', onLoad);
window.addEventListener('error', evt => {
  if (evt.error instanceof DwstError) {
    evt.preventDefault();
    errorHandler(pluginInterface, evt.error);
  }
});

// plugin interface developer access for live debugging
if (typeof window === 'object') {
  window._dwst = pluginInterface;
}
