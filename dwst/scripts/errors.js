/**

  Authors: Toni Ruottu, Finland 2010-2018

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

export class dwstError extends Error {}

export class NoConnection extends dwstError {
  constructor(msg) {
    super();
    this.msg = msg;
  }
}
export class AlreadyConnected extends dwstError {}
export class SocketError extends dwstError {}

export class InvalidSyntax extends dwstError {}
export class InvalidArgument extends dwstError {}
export class InvalidCombination extends dwstError {
  constructor(command, commands) {
    super();
    this.command = command;
    this.commands = commands;
  }
}

export class UnknownCommand extends dwstError {}
export class UnknownInstruction extends dwstError {}
export class UnknownHelpPage extends dwstError {}
export class UnknownText extends dwstError {}
export class UnknownBinary extends dwstError {}
export class NoInterval extends dwstError {}

function errorToMLog(error) {
  if (error instanceof NoConnection) {
    const connectTip = [
      'Use ',
      {
        type: 'dwstgg',
        text: 'connect',
        section: 'connect',
      },
      ' to form a connection and try again.',
    ];
    return ['No connection.', `Cannot send: ${error.msg}`, connectTip];
  /*
  ./plugins/send.js:      this._dwst.terminal.mlog(['No connection.', `Cannot send: ${msg}`, connectTip], 'error');
  ./plugins/binary.js:      this._dwst.terminal.mlog(['No connection.', `Cannot send: ${msg}`, connectTip], 'error');
  ./plugins/spam.js:        this._dwst.terminal.log('spam failed, no connection', 'error');
  ./plugins/interval.js:          this._dwst.terminal.log('interval failed, no connection', 'error');
  */
  }
/*
  if (error instanceof AlreadyConnected) {
  ./plugins/connect.js:      ], 'error');
  }
*/
  if (error instanceof SocketError) {
    return ['WebSocket error.'];
  }
/*
  if (error instanceof InvalidSyntax) {
  ./plugins/send.js:        this._dwst.terminal.mlog(['Syntax error.'], 'error');
  ./plugins/binary.js:        this._dwst.terminal.mlog(['Syntax error.'], 'error');
  }
  if (error instanceof InvalidArgument) {
  ./plugins/forget.js:      this._dwst.terminal.mlog([`Invalid argument: ${target}`, historyLine], 'error');
  }
*/
  if (error instanceof InvalidCombination) {
    // TODO: links
    return [`Invalid ${error.command} command combination.`, `Compatible commands: ${error.commands.join(', ')}`];
  }
/*
  if (error instanceof UnknownCommand) {
  ./plugins/help.js:      this._dwst.terminal.log(`the command does not exist: ${command}`, 'error');
  ./dwst.js:    terminal.mlog([errorMessage, helpTip], 'error');  
  }
  if (error instanceof UnknownInstruction) {
  ./plugins/send.js:        this._dwst.terminal.mlog(message, 'error');
  ./plugins/binary.js:        this._dwst.terminal.mlog(message, 'error');
  }
  if (error instanceof UnknownHelpPage) {
  ./plugins/help.js:    this._dwst.terminal.log(`Unkown help page: ${page}`, 'error');
  }
  if (error instanceof UnknownText) {
  ./plugins/texts.js:      this._dwst.terminal.mlog([`Text "${variable}" does not exist.`, listTip], 'error');
  }
  if (error instanceof UnknownBinary) {
  ./plugins/bins.js:      this._dwst.terminal.mlog([`Binary "${variable}" does not exist.`, listTip], 'error');
  }
  if (error instanceof NoInterval) {
  ./plugins/interval.js:        this._dwst.terminal.log('no interval to clear', 'error');
  }
  */
}

export function errorHandler(terminal, error) {
  if (error instanceof dwstError === false) {
    throw error;
  }
  terminal.mlog(errorToMLog(error), 'error');
}
