
/**

  Authors: Toni Ruottu, Finland 2010-2018

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import currenttime from '../currenttime.js';
import renderMlog from './mlog.js';

export default function renderLogEntry(mlog, type, linkHandlers) {
  const content = renderMlog(mlog, type, linkHandlers);

  const time = currenttime();
  const logEntry = document.createElement('span');
  logEntry.setAttribute('class', 'dwst-log-entry');
  logEntry.innerHTML = `<span class="dwst-log-entry__time dwst-time">${time}</span><span class="dwst-log-entry__direction dwst-direction dwst-direction--${type}">${type}:</span>`;
  const contentCell = document.createElement('span');
  contentCell.setAttribute('class', 'dwst-log-entry__content');
  contentCell.appendChild(content);
  logEntry.appendChild(contentCell);
  return logEntry;
}


