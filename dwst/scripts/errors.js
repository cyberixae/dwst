/**

  Authors: Toni Ruottu, Finland 2010-2018

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

export class dwstError extends Error {}

export class noConnection extends dwstError {
  constructor(msg) {
    super();
    this.msg = msg;
  }
}
export class alreadyConnected extends dwstError {}
export class socketError extends dwstError {}

export class invalidSyntax extends dwstError {}
export class invalidArgument extends dwstError {}

export class unknownCommand extends dwstError {}
export class unknownInstruction extends dwstError {}
export class unknownHelpPage extends dwstError {}
export class unknownText extends dwstError {}
export class unknownBinary extends dwstError {}
export class noInterval extends dwstError {}

function errorToMLog(error) {
  if (error instanceof noConnection) {
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
  if (error instanceof alreadyConnected) {
  ./plugins/connect.js:      ], 'error');
  }
  if (error instanceof socketError) {
  ./dwst.js:    terminal.log('WebSocket error.', 'error');
  }
  if (error instanceof invalidSyntax) {
  ./plugins/send.js:        this._dwst.terminal.mlog(['Syntax error.'], 'error');
  ./plugins/binary.js:        this._dwst.terminal.mlog(['Syntax error.'], 'error');
  }
  if (error instanceof invalidArgument) {
  ./plugins/forget.js:      this._dwst.terminal.mlog([`Invalid argument: ${target}`, historyLine], 'error');
  }
  if (error instanceof unknownCommand) {
  ./plugins/help.js:      this._dwst.terminal.log(`the command does not exist: ${command}`, 'error');
  ./dwst.js:    terminal.mlog([errorMessage, helpTip], 'error');  
  }
  if (error instanceof unknownInstruction) {
  ./plugins/send.js:        this._dwst.terminal.mlog(message, 'error');
  ./plugins/binary.js:        this._dwst.terminal.mlog(message, 'error');
  }
  if (error instanceof unknownHelpPage) {
  ./plugins/help.js:    this._dwst.terminal.log(`Unkown help page: ${page}`, 'error');
  }
  if (error instanceof unknownText) {
  ./plugins/texts.js:      this._dwst.terminal.mlog([`Text "${variable}" does not exist.`, listTip], 'error');
  }
  if (error instanceof unknownBinary) {
  ./plugins/bins.js:      this._dwst.terminal.mlog([`Binary "${variable}" does not exist.`, listTip], 'error');
  }
  if (error instanceof noInterval) {
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
