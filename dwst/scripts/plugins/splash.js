
/**

  Authors: Toni Ruottu, Finland 2010-2017

  This file is part of Dark WebSocket Terminal.

  CC0 1.0 Universal, http://creativecommons.org/publicdomain/zero/1.0/

  To the extent possible under law, Dark WebSocket Terminal developers have waived all
  copyright and related or neighboring rights to Dark WebSocket Terminal.

*/

export default class Splash {

  constructor(dwst) {
    this._dwst = dwst;
  }

  commands() {
    return ['splash'];
  }

  usage() {
    return [
      '/splash',
    ];
  }

  examples() {
    return [
      '/splash',
    ];
  }

  info() {
    return 'revisit welcome screen';
  }

  run() {

    this._dwst.terminal.clearLog();

    /* eslint-disable quotes,object-property-newline */

    const SPLASH = [
      [
        // ".       HH.      dd .        ..  TT    ..        ..        ..        ..    TT  ..        . dd      .HH       .",
        "                                                                                                              ",
        "                                                                                                              ",
        "                                                                                                              ",
        "                                                                                                              ",
        "                                   `ggg.                                                                      ",
        "                                     ggg                                                                      ",
        "                                      gg.                                                                     ",
        "                                       gg                                 ggg'                                ",
        "                                       gg                                 gg                                  ",
        "                                   ,ggg g.  ggg       ggg.   .gggggg.     g                                   ",
        "                                 ,gg  `ggg ggg         ggg. gg      `g.  gg                                   ",
        "                                 gg     gg.g'           `gg gg.       `gggggg'                                ",
        "                                 gg     ggg'             gg. 'gggggg.  ,g                                     ",
        "                                 ll.     ll.     ,l.      ll       `ll l.                                     ",
        "                                  ll.   llll.   ,lll.   ,ll l`     ,ll ll.                                    ",
        "                                   `lllll' `lllll' `lllll'  `lllllll'   lll.                                  ",
        "                                                                                                              ",
        "                                                                                                              ",
        "                                                                                                              ",
      ],
      [
        "                                                                                                              ",
        "                                                                                                              ",
        "                                                                                                              ",
        "                                                                                                              ",
        "                                   fffff                                                                      ",
        "                                     fff                                                                      ",
        "                                      fff                                                                     ",
        "                                       ff                                 ffff                                ",
        "                                       ff                                 ff                                  ",
        "                                   ffff ff  fff       ffff   ffffffff     f                                   ",
        "                                 fff  ffff fff         ffff ff      fff  ff                                   ",
        "                                 ff     fffff           fff fff       ffffffff                                ",
        "                                 ff     ffff             fff ffffffff  ff                                     ",
        "                                 555     555     555      55       555 55                                     ",
        "                                  555   55555   55555   555 55     555 555                                    ",
        "                                   5555555 5555555 5555555  555555555   5555                                  ",
        "                                                                                                              ",
        "                                                                                                              ",
        "                                                                                                              ",
      ],
    ];
    /*
    const xmasColors = [
      "                                                                                                              ",
      "                                                                                                              ",
      "                                                                                                              ",
      "                                                                                                              ",
      "                                    xxxx                                                                      ",
      "                                     111                                                                      ",
      "                                      11x                                                                     ",
      "                                       11                                 xxxx                                ",
      "                                       11                                 11                                  ",
      "                                   xxx1 11  xxx       xxxx   xxxxxxxx     1                                   ",
      "                                 xx1  1111 111         111x x1      1xx  x1                                   ",
      "                                 11     11111           111 111       1xx11111                                ",
      "                                 11     1111             11x 11111111  11                                     ",
      "                                 222     222     222      22       222 22                                     ",
      "                                  222   22222   22222   222 22     222 222                                    ",
      "                                   2222222 2222222 2222222  222222222   2222                                  ",
      "                                                                                                              ",
      "                                                                                                              ",
      "                                                                                                              ",
    ];
    */

    /* eslint-enable quotes,object-property-newline */

    const CONNECTION_LIST_CAP = 3;
    const historySummary = this._dwst.historyManager.getSummary();
    const maybeTooManyConnectCommands =  this._dwst.historyManager.getConnectCommands(CONNECTION_LIST_CAP + 1);
    const connectCommands = maybeTooManyConnectCommands.slice(0, CONNECTION_LIST_CAP);
    const connectionsLines = connectCommands.map(command => {
      return {
        type: 'command',
        text: command,
      };
    });
    const tooManyWarning = (() => {
      if (maybeTooManyConnectCommands.length > CONNECTION_LIST_CAP) {
        return [`(more than ${CONNECTION_LIST_CAP} in total, hiding some)`];
      }
      return [];
    })();
    const historySection = ([
      historySummary.concat([
        ', including ',
        {
          type: 'dwstgg',
          text: 'connect',
          section: 'connect',
        },
        ' commands',
      ]),
    ]).concat(
      connectionsLines,
    ).concat(
      tooManyWarning,
    );
    const statusSection = (() => {
      if (this._dwst.connection === null) {
        return [];
      }
      const connectionStatus = [
        'Currently ',
        this._dwst.connection.verb,
        ' to ',
        {
          type: 'strong',
          text: this._dwst.connection.url,
        },
      ];
      const maybeProtocolStatus = (() => {
        const protocol = this._dwst.connection.protocol;
        if (protocol.length < 1) {
          return [];
        }
        return [
          [
            'Selected protocol: ',
            {
              type: 'strong',
              text: protocol,
            },
          ],
        ];
      })();
      const disconnectInstructions = [
        'Type ',
        {
          type: 'command',
          text: '/disconnect',
        },
        ' to end the connection',
      ];
      return ([
        connectionStatus,
      ]).concat(maybeProtocolStatus).concat([
        '',
        disconnectInstructions,
      ]);
    })();
    const about = [
      [
        {
          type: 'h1',
          text: `Dark WebSocket Terminal ${this._dwst.VERSION}`,
        },
      ],
    ];
    const beginnerInfo = [
      [
        '1. Create a test connection by typing ',
        {
          type: 'command',
          text: `/connect ${this._dwst.ECHO_SERVER_URL}`,
        },
      ],
      [
        '2. Type messages into the text input',
      ],
      [
        '3. Click on DWST logo if you get lost',
      ],
    ];
    const helpReminder = [
      [
        'Type ',
        {
          type: 'command',
          text: '/help',
        },
        ' to see the full range of available commands',
      ],
    ];
    const privacyReminder = [
      [
        {
          type: 'dwstgg',
          text: 'Check',
          section: '#privacy',
          warning: true,
        },
        ' privacy and tracking info',
      ],
    ];
    const linkSection = [
      [
        {
          type: 'link',
          text: 'GitHub',
          url: 'https://github.com/dwst/dwst',
        },
        {
          type: 'regular',
          text: ' &bull; ',
          unsafe: true,
        },
        {
          type: 'link',
          text: 'chat',
          url: 'https://gitter.im/dwst/dwst',
        },
        {
          type: 'regular',
          text: ' &bull; ',
          unsafe: true,
        },
        {
          type: 'link',
          text: 'rfc6455',
          url: 'https://tools.ietf.org/html/rfc6455',
        },
        {
          type: 'regular',
          text: ' &bull; ',
          unsafe: true,
        },
        {
          type: 'link',
          text: 'iana',
          url: 'https://www.iana.org/assignments/websocket/websocket.xhtml',
        },
      ],
    ];
    const sections = (() => {
      if (this._dwst.connection !== null) {
        return [
          about,
          [''],
          statusSection,
          [''],
          helpReminder,
          [''],
          linkSection,
        ];
      }
      if (connectCommands.length > 0) {
        return [
          about,
          [''],
          historySection,
          [''],
          privacyReminder,
          [''],
          helpReminder,
          [''],
          linkSection,
        ];
      }
      return [
        about,
        [''],
        beginnerInfo,
        [''],
        privacyReminder,
        [''],
        helpReminder,
        [''],
        linkSection,
      ];
    })();
    this._dwst.terminal.gfx(...SPLASH);
    this._dwst.terminal.mlog([].concat(...sections), 'system');
  }

}
