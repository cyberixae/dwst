
/**

  Authors: Toni Ruottu, Finland 2010-2018

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

import DwstFunction from '../types/function.js';

export default class PromptHandler {

  constructor(dwst) {
    this._dwst = dwst;
    this._encoder = new TextEncoder();
  }

  _reduce(instr, params) {
    if (instr === 'default') {
      return params[0];
    }
    const func = this._dwst.model.variables.getVariable(instr);
    if (func === null) {
      throw new this._dwst.lib.errors.UnknownInstruction(instr);
    }
    if (func instanceof DwstFunction) {
      return func.run(params);
    }
    throw new this._dwst.lib.errors.InvalidDataType(instr, ['FUNCTION']);
  }

  _encode(chunk) {
    if (chunk.constructor === Uint8Array) {
      return chunk;
    }
    if (typeof chunk === 'string') {
      return this._encoder.encode(chunk);
    }
    throw new Error('unexpected chunk type');
  }

  _getChunk(particle) {
    const [functionName, ...args] = particle;
    const output = this._reduce(functionName, args);
    const binary = this._encode(output);
    return binary;
  }

  _eval(paramString) {
    const parsed = this._dwst.lib.particles.parseParticles(paramString);
    const chunks = parsed.map(particle => this._getChunk(particle));
    const result = this._dwst.lib.utils.joinBuffers(chunks).buffer;
    return result;
  }

  _runPlugin(pluginName, paramString) {
    const plugin = this._dwst.plugins.getPlugin(pluginName);
    if (plugin === null) {
      throw new this._dwst.lib.errors.UnknownCommand(pluginName);
    }
    if (plugin.functionSupport) {
      const binary = this._eval(paramString);
      plugin.run(binary);
    } else {
      plugin.run(paramString);
    }
  }

  run(command) {
    const [pluginName, ...params] = command.split(' ');
    const paramString = params.join(' ');
    this._runPlugin(pluginName, paramString);
  }

  silent(line) {
    const noslash = line.substring(1);
    this.run(noslash);
  }

  loud(line) {
    this._dwst.ui.terminal.log(line, 'command');
    this.silent(line);
  }
}
