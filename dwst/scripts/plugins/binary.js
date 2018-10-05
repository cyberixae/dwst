
/**

  Authors: Toni Ruottu, Finland 2010-2018

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import {InvalidParticles} from '../particles.js';

class UnknownInstruction extends Error {

  constructor(instruction) {
    super();
    this.instruction = instruction;
  }
}

function byteValue(x) {
  const code = x.charCodeAt(0);
  if (code !== (code & 0xff)) { // eslint-disable-line no-bitwise
    return 0;
  }
  return code;
}

function hexpairtobyte(hp) {
  const hex = hp.join('');
  if (hex.length !== 2) {
    return null;
  }
  return parseInt(hex, 16);
}

function joinBuffers(buffersToJoin) {
  let total = 0;
  for (const buffer of buffersToJoin) {
    total += buffer.length;
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const buffer of buffersToJoin) {
    out.set(buffer, offset);
    offset += buffer.length;
  }
  return out.buffer;
}

export default class Binary {

  constructor(dwst) {
    this._dwst = dwst;
  }

  commands() {
    return ['binary', 'b'];
  }

  usage() {
    return [
      '/binary [template]',
      '/b [template]',
    ];
  }

  examples() {
    return [
      '/binary Hello world!',
      '/binary multiline\\r\\nmessage',
      '/binary ${random(16)}',
      '/binary ${text()}',
      '/binary ${bin()}',
      '/binary ["JSON","is","cool"]',
      '/binary ${range(0,0xff)}',
      '/binary ${hex(1234567890abcdef)}',
      '/binary ${hex(52)}${random(1)}lol',
      '/b Available now with ~71.43% less typing!',
    ];
  }

  info() {
    return 'send binary data';
  }

  _process(instr, params) {
    if (instr === 'default') {
      const text = params[0];
      const bytes = [...text].map(byteValue);
      return new Uint8Array(bytes);
    }
    if (instr === 'random') {
      const randombyte = () => {
        const out = Math.floor(Math.random() * (0xff + 1));
        return out;
      };
      let num = 16;
      if (params.length === 1) {
        num = this._dwst.lib.utils.parseNum(params[0]);
      }
      const bytes = [];
      for (let i = 0; i < num; i++) {
        bytes.push(randombyte());
      }
      return new Uint8Array(bytes);
    }
    if (instr === 'range') {
      let start = 0;
      let end = 0xff;
      if (params.length === 1) {
        end = this._dwst.lib.utils.parseNum(params[0]);
      }
      if (params.length === 2) {
        start = this._dwst.lib.utils.parseNum(params[0]);
        end = this._dwst.lib.utils.parseNum(params[1]);
      }
      const bytes = [];
      for (let i = start; i <= end; i++) {
        bytes.push(i);
      }
      return new Uint8Array(bytes);
    }
    if (instr === 'bin') {
      let variable = 'default';
      if (params.length === 1) {
        variable = params[0];
      }
      let buffer = this._dwst.model.bins.get(variable);
      if (typeof buffer === 'undefined') {
        buffer = [];
      }
      return new Uint8Array(buffer);
    }
    if (instr === 'text') {
      let variable = 'default';
      if (params.length === 1) {
        variable = params[0];
      }
      const text = this._dwst.model.texts.get(variable);
      let bytes;
      if (typeof text === 'undefined') {
        bytes = [];
      } else {
        bytes = [...text].map(byteValue);
      }
      return new Uint8Array(bytes);
    }
    if (instr === 'hex') {
      let bytes;
      if (params.length === 1) {
        const hex = params[0];
        const nums = hex.split('');
        const pairs = this._dwst.lib.utils.chunkify(nums, 2);
        const tmp = pairs.map(hexpairtobyte);
        bytes = tmp.filter(b => (b !== null));
      } else {
        bytes = [];
      }
      return new Uint8Array(bytes);
    }
    throw new UnknownInstruction(instr);
  }


  run(paramString) {
    let parsed;
    try {
      parsed = this._dwst.lib.particles.parseParticles(paramString);
    } catch (e) {
      if (e instanceof InvalidParticles) {
        this._dwst.ui.terminal.mlog(['Syntax error.'], 'error');
        return;
      }
      throw e;
    }
    let processed;
    try {
      processed = parsed.map(particle => {
        const [instruction, ...args] = particle;
        return this._process(instruction, args);
      });
    } catch (e) {
      if (e instanceof UnknownInstruction) {
        const message = [
          [
            'No helper ',
            {
              type: 'strong',
              text: e.instruction,
            },
            ' available for ',
            {
              type: 'dwstgg',
              text: 'binary',
              section: 'binary',
            },
            '.',
          ],
        ];
        this._dwst.ui.terminal.mlog(message, 'error');
        return;
      }
      throw e;
    }
    const out = joinBuffers(processed);

    const msg = `<${out.byteLength}B of data> `;

    const connection = this._dwst.model.connection;
    if (connection === null || connection.isClosing() || connection.isClosed()) {
      const connectTip = [
        'Use ',
        {
          type: 'dwstgg',
          text: 'connect',
          section: 'connect',
        },
        ' to form a connection and try again.',
      ];
      this._dwst.ui.terminal.mlog(['No connection.', `Cannot send: ${msg}`, connectTip], 'error');
      return;
    }
    this._dwst.ui.terminal.blog(out, 'sent');
    this._dwst.model.connection.send(out);
  }
}

