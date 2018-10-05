
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

import particles from './particles.js';
import utils from './utils.js';

import Dwstgg from './dwstgg/dwstgg.js';
import Ui from './ui/ui.js';

import LinkHandler from './controllers/links.js';
import PromptHandler from './controllers/prompt.js';
import SocketHandler from './controllers/socket.js';

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

function loadHistory() {
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
  return new History(history, {save});
}

const dwst = Object.seal({
  model: {},
  controller: {},
  lib: {},
  plugins: null,
  ui: null,
});

dwst.model.config = config;
dwst.model.history = loadHistory();
dwst.model.dwstgg = new Dwstgg(dwst);
dwst.model.connection = null; // FIXME connection model
dwst.model.bins = new Map();  // FIXME bin model
dwst.model.texts = new Map(); // FIXME text model
dwst.model.intervalId = null; // FIXME interval model
dwst.model.spam = null;       // FIXME spam model?

dwst.controller.link = new LinkHandler(dwst);
dwst.controller.prompt = new PromptHandler(dwst);
dwst.controller.socket = new SocketHandler(dwst);

dwst.lib.utils = utils;
dwst.lib.particles = particles;

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

document.addEventListener('DOMContentLoaded', () => {
  dwst.ui = new Ui(document, dwst);
  dwst.ui.init();
});

window.addEventListener('load', () => {
  dwst.ui.onLoad();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service_worker.js');
  }
});

// for live debugging
window._dwst = dwst;
