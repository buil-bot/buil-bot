const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const interaction = require('autocode-discord-interaction')

await interaction.callback.command_reply(context.params.event, {
  embeds: [
    {
      title: `Command categories`,
      color: 0x00ff00,
      fields: [
        {
          name: `Moderaction commands`,
          value: `includes all the mod commands. Eg: kick, ban, etc`,
          inline: true
        },
        {
          name: `Economy commands`,
          value: `includes all the eco commands. Eg: balance, rob, find, etc`,
          inline: true
        },
        {
          name: `Setup commands`,
          value: `includes all setup commands. Eg: set prefix, mute role, log channel, etc`,
          inline: true
        },
        {
          name: `Music commands`,
          value: `includes all music commands. Eg: play, pause, resume, etc`,
          inline: true
        },
        {
          name: `Level commands`,
          value: `includes all level commands, Eg: check level, leaderboard`,
          inline: true
        },
      ]
    }
  ],
  components: [
    {
      type: 1,
      components: [
        {
          "custom_id": `help-menu`,
          "placeholder": `Select a categories`,
          "options": [
            {
              "label": `Moderation`,
              "value": `mod`,
              "description": `all mod commands`,
              "default": false
            },
            {
              "label": `Economy`,
              "value": `eco`,
              "description": `all eco commands`,
              "default": false
            },
            {
              "label": `Setup`,
              "value": `setup`,
              "description": `all setup commands`,
              "default": false
            },
            {
              "label": `Music`,
              "value": `music`,
              "description": `all music commands`,
              "default": false
            },
            {
              "label": `Level`,
              "value": `level`,
              "description": `all level commands`,
              "default": false
            }
          ],
          "min_values": 1,
          "max_values": 1,
          "type": 3
        }
      ]
    }
  ]
})