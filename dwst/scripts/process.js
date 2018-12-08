
/**

  Authors: Toni Ruottu, Finland 2010-2018

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import utils from './lib/utils.js';
import errors from './lib/errors.js';

import Bin from './functions/bin.js';
import ByteRange from './functions/byte_range.js';
import CharRange from './functions/char_range.js';
import Hex from './functions/hex.js';
import RandomBytes from './functions/random_bytes.js';
import RandomChars from './functions/random_chars.js';
import Text from './functions/text.js';
import Time from './functions/time.js';

export default function process(_dwst, instr, params) {

  if (instr === 'default') {
    return params[0];
  }
  if (instr === 'randomChars') {
    return new RandomChars(_dwst).run(params);
  }
  if (instr === 'text') {
    return new Text(_dwst).run(params);
  }
  if (instr === 'time') {
    return new Time(_dwst).run(params);
  }
  if (instr === 'charRange') {
    return new CharRange(_dwst).run(params);
  }
  if (instr === 'randomBytes') {
    return new RandomBytes(_dwst).run(params);
  }
  if (instr === 'byteRange') {
    return new ByteRange(_dwst).run(params);
  }
  if (instr === 'bin') {
    return new Bin(_dwst).run(params);
  }
  if (instr === 'hex') {
    return new Hex(_dwst).run(params);
  }

  throw new errors.UnknownInstruction(instr, 'send');
}
