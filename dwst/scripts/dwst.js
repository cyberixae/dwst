
/**

  Authors: Toni Ruottu, Finland 2010-2018
           William Orr, US 2012

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import config from './models/config.js';
import History from './models/history.js';
import Plugins from './models/plugins.js';
import Dwstgg from './dwstgg/dwstgg.js';

import LinkHandler from './controllers/links.js';
import PromptHandler from './controllers/prompt.js';
import SocketHandler from './controllers/socket.js';

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

const dwst = {
  connection: null, // FIXME connection model
  bins: new Map(),  // FIXME bin model
  texts: new Map(), // FIXME text model
  intervalId: null, // FIXME interval model
  spam: null,       // FIXME spam model?
  model: {
    config,
    history: null,
  },
  ui: null,
  controller: null,
  plugins: null,
};

dwst.controller = {
  link: new LinkHandler(dwst),
  prompt: new PromptHandler(dwst),
  socket: new SocketHandler(dwst),
};

dwst.dwstgg = new Dwstgg(dwst);

dwst.plugins = new Plugins(dwst, [
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
]);

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
  dwst.model.history = new History(history, {save});
}

function init() {
  loadSaves();
  dwst.ui = new Ui(document, dwst);
  dwst.ui.init();
}

function onLoad() {
  dwst.ui.onLoad();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service_worker.js');
  }
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', onLoad);

// plugin interface developer access for live debugging
if (typeof window === 'object') {
  window._dwst = dwst;
}
