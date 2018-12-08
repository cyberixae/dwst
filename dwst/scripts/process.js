
/**

  Authors: Toni Ruottu, Finland 2010-2018

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

function hexpairtobyte(hp) {
  const hex = hp.join('');
  if (hex.length !== 2) {
    return null;
  }
  return parseInt(hex, 16);
}

export default function process(_dwst, instr, params) {

  if (instr === 'default') {
    return params[0];
  }
  if (instr === 'randomChars') {
    const randomchar = () => {
      let out = Math.floor(Math.random() * (0xffff + 1));
      out /= 2; // avoid risky characters
      const char = String.fromCharCode(out);
      return char;
    };
    let num = 16;
    if (params.length === 1) {
      num = _dwst.lib.utils.parseNum(params[0]);
    }
    let str = '';
    for (let i = 0; i < num; i++) {
      str += randomchar();
    }
    return str;
  }
  if (instr === 'text') {
    let variable = 'default';
    if (params.length === 1) {
      variable = params[0];
    }
    return _dwst.model.texts.get(variable);
  }
  if (instr === 'time') {
    return String(Math.round(new Date().getTime() / 1000));
  }
  if (instr === 'charRange') {
    let start = 32;
    let end = 126;
    if (params.length === 1) {
      end = _dwst.lib.utils.parseNum(params[0]);
    }
    if (params.length === 2) {
      start = _dwst.lib.utils.parseNum(params[0]);
      end = _dwst.lib.utils.parseNum(params[1]);
    }
    let str = '';
    for (let i = start; i <= end; i++) {
      str += String.fromCharCode(i);
    }
    return str;
  }
  if (instr === 'randomBytes') {
    const randombyte = () => {
      const out = Math.floor(Math.random() * (0xff + 1));
      return out;
    };
    let num = 16;
    if (params.length === 1) {
      num = _dwst.lib.utils.parseNum(params[0]);
    }
    const bytes = [];
    for (let i = 0; i < num; i++) {
      bytes.push(randombyte());
    }
    return new Uint8Array(bytes);
  }
  if (instr === 'byteRange') {
    let start = 0;
    let end = 0xff;
    if (params.length === 1) {
      end = _dwst.lib.utils.parseNum(params[0]);
    }
    if (params.length === 2) {
      start = _dwst.lib.utils.parseNum(params[0]);
      end = _dwst.lib.utils.parseNum(params[1]);
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
    let buffer = _dwst.model.bins.get(variable);
    if (typeof buffer === 'undefined') {
      buffer = [];
    }
    return new Uint8Array(buffer);
  }
  if (instr === 'hex') {
    let bytes;
    if (params.length === 1) {
      const hex = params[0];
      const nums = hex.split('');
      const pairs = _dwst.lib.utils.chunkify(nums, 2);
      const tmp = pairs.map(hexpairtobyte);
      bytes = tmp.filter(b => (b !== null));
    } else {
      bytes = [];
    }
    return new Uint8Array(bytes);
  }

  throw new _dwst.lib.errors.UnknownInstruction(instr, 'send');
}
