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

export class InvalidParticles extends dwstError { }
export class InvalidArgument extends dwstError {
  constructor(argument, extraInfo) {
    super();
    this.argument = argument;
    this.extraInfo = extraInfo;
  }
}
export class InvalidCombination extends dwstError {
  constructor(command, commands) {
    super();
    this.command = command;
    this.commands = commands;
  }
}

export class UnknownCommand extends dwstError {
  constructor(command) {
    super();
    this.command = command;
  }
}

export class UnknownInstruction extends dwstError {
  constructor(instruction, command) {
    super();
    this.instruction = instruction;
    this.command = command;
  }
}

export class UnknownHelpPage extends dwstError {
  constructor(page) {
    super();
    this.page = page;
  }
}
export class UnknownText extends dwstError {
  constructor(variable) {
    super();
    this.variable = variable;
  }
}
export class UnknownBinary extends dwstError {
  constructor(variable) {
    super();
    this.variable = variable;
  }
}
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
  }
  if (error instanceof AlreadyConnected) {
    return [
      'Already connected to a server',
      [
        'Type ',
        {
          type: 'command',
          text: '/disconnect',
        },
        ' to end the connection',
      ],
    ];
  }
  if (error instanceof SocketError) {
    return ['WebSocket error.'];
  }
  if (error instanceof InvalidParticles) {
    return ['Syntax error.'];
  }
  if (error instanceof InvalidArgument) {
    return [`Invalid argument: ${error.argument}`, error.extraInfo];
  }
  if (error instanceof InvalidCombination) {
    // TODO: links
    return [`Invalid ${error.command} command combination.`, `Compatible commands: ${error.commands.join(', ')}`];
  }
  if (error instanceof UnknownCommand) {
    const helpTip = [
      'type ',
      {
        type: 'command',
        text: '/help #commands',
      },
      ' to list available commands',
    ];
    return [`invalid command: ${error.command}`, helpTip];
  }
  if (error instanceof UnknownInstruction) {
    return [
      [
        'No helper ',
        {
          type: 'strong',
          text: error.instruction,
        },
        ' available for ',
        {
          type: 'dwstgg',
          text: error.command,
          section: error.command,
        },
        '.',
      ],
    ];
  }
  if (error instanceof UnknownHelpPage) {
    const listTip = [
      'Display help index by typing ',
      {
        type: 'command',
        text: '/help',
      },
    ];
    return [`Unkown help page: ${error.page}`, listTip];
  }
  if (error instanceof UnknownText) {
    const listTip = [
      'List available texts by typing ',
      {
        type: 'command',
        text: '/texts',
      },
    ];
    return [`Text "${error.variable}" does not exist.`, listTip];
  }
  if (error instanceof UnknownBinary) {
    const listTip = [
      'List available binaries by typing ',
      {
        type: 'command',
        text: '/bins',
      },
    ];
    return [`Binary "${error.variable}" does not exist.`, listTip];
  }
  if (error instanceof NoInterval) {
    return ['no interval to clear'];
  }
}

export function errorHandler(terminal, error) {
  if (error instanceof dwstError === false) {
    throw error;
  }
  terminal.mlog(errorToMLog(error), 'error');
}
