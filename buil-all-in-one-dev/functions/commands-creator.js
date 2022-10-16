const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let commands = [
  //mod command ⬇
  {
    name: `mod`,
    description: `All mod commands`,
    options: [
      {
        type: 1,
        name: 'kick',
        description: 'kick a member from the server.',
        options: [
          {
            type: 6,
            name: 'user',
            description: 'the user to kick',
            required: true,
          },
          {
            type: 3,
            name: 'reason',
            description: 'why are you kicking?',
          },
        ],
      },
      {
        type: 1,
        name: 'ban',
        description: 'ban a member from the server.',
        options: [
          {
            type: 6,
            name: 'user',
            description: 'the user to ban',
            required: true,
          },
          {
            type: 3,
            name: 'reason',
            description: 'why are you banning?',
          },
        ],
      },
      {
        type: 1,
        name: 'mute',
        description: 'mute a member in the server.',
        options: [
          {
            type: 6,
            name: 'user',
            description: 'the user to mute',
            required: true,
          },
          {
            type: 3,
            name: 'reason',
            description: 'why are you muting?',
          },
        ],
      },
      {
        type: 1,
        name: 'unmute',
        description: 'unmute a member in the server.',
        options: [
          {
            type: 6,
            name: 'user',
            description: 'the user to unmute',
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: 'warn',
        description: 'warn a member in the server.',
        options: [
          {
            type: 6,
            name: 'user',
            description: 'the user to warn',
            required: true,
          },
          {
            type: 3,
            name: 'reason',
            description: 'why are you warning?',
          },
        ],
      },
      {
        type: 1,
        name: 'report',
        description: 'report a member from the server.',
        options: [
          {
            type: 6,
            name: 'user',
            description: 'the user to report',
            required: true,
          },
        ],
      },
    ],
  },
  //eco command ⬇
  {
    name: 'eco',
    description: 'All eco commands',
    options: [
      {
        type: 1,
        name: 'start',
        description: 'start the game',
      },
      {
        type: 1,
        name: 'balance',
        description: 'check your balance or someone else\'s',
        options: [
          {
            type: 6,
            name: 'user',
            description: 'the user to check balance for',
          },
        ],
      },
      {
        type: 1,
        name: 'give',
        description: 'give someone your coins',
        options: [
          {
            type: 6,
            name: 'user',
            description: 'the user to give',
            required: true,
          },
          {
            type: 10,
            name: 'amount',
            description: 'The amount you want to give.',
            min_value: 1,
            required: true,
          }
        ],
      },
      {
        type: 1,
        name: 'deposite',
        description: 'add money to your bank',
        options: [
          {
            type: 10,
            name: 'amount',
            description: 'The amount you want to deposite.',
            min_value: 1,
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: 'withdraw',
        description: 'take money from your bank',
        options: [
          {
            type: 10,
            name: 'amount',
            description: 'The amount you want to withdraw.',
            min_value: 1,
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: 'rob',
        description: 'rob someone in the server',
        options: [
          {
            type: 6,
            name: 'user',
            description: 'the user to rob',
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: 'find',
        description: 'find coins from some place',
      },
      {
        type: 1,
        name: 'leaderboard',
        description: 'check the leaderboard',
      },
    ]
  },
  //setup command ⬇
  {
    name: 'setup',
    description: 'All setup commands',
    options: [
      {
        type: 1,
        name: 'prefix',
        description: 'change the prefix of the server',
        options: [
          {
            type: 3,
            name: 'prefix',
            description: 'the new prefix',
            required: true
          },
        ],
      },
      {
        type: 1,
        name: 'mute-role',
        description: 'set a mute role for the server',
        options: [
          {
            type: 8,
            name: 'role',
            description: 'the mute role',
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: 'welcome-channel',
        description: 'set a welcome channel for the server',
        options: [
          {
            type: 7,
            name: 'channel',
            description: 'the welcome channel',
            required: true,
            channel_types: [0,5,6,10,11,12]
          },
        ],
      },
      {
        type: 1,
        name: 'log-channel',
        description: 'set a log channel for the server',
        options: [
          {
            type: 7,
            name: 'channel',
            description: 'the log channel',
            required: true,
            channel_types: [0,5,6,10,11,12]
          },
        ],
      },
    ]
  },
  //level command ⬇
  {
    name: 'level',
    description: 'All level commands',
    options: [
      {
        type: 1,
        name: 'check',
        description: 'check your level or someone else\'s',
        options: [
          {
            type: 6,
            name: 'user',
            description: 'the user to check level for',
          },
        ],
      },
      {
        type: 1,
        name: 'leaderboard',
        description: 'check the leaderboard',
      },
    ]
  },
  //music command ⬇
  {
    name: 'music',
    description: `All music commands`,
    options: [
      {
        type: 1,
        name: 'play',
        description: 'play some music',
        options: [
          {
            type: 3,
            name: 'search-term',
            description: 'search a music by name',
            required: true
          },
        ],
      },
      {
        type: 1,
        name: 'pause',
        description: 'pause the music'
      },
      {
        type: 1,
        name: 'resume',
        description: 'resume the music'
      },
      {
        type: 1,
        name: 'skip',
        description: 'skip the music'
      },
      {
        type: 1,
        name: 'disconnect',
        description: 'disconnect me from a vc'
      },
      {
        type: 1,
        name: 'queue',
        description: 'check the current queue'
      },
    ]
  },
  //help command ⬇
  {
    name: 'help',
    description: 'show the help menu'
  }
]
await lib.discord.commands['@0.1.0'].bulkOverwrite({
  commands: commands
});