const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const guild_data = await require('../../../helpers/guildData.js')(context.params.event)

let type = context.params.event.data.values[0]
let embeds = [{
  title: `${type} commands`,
  color: 0x00ff00,
  description: `prefix \`${guild_data.rows[0].fields.prefix}\``
}]
context.params.event.message.components[0]?.components[0]?.options?.find(o => o.default === true)?.default ? context.params.event.message.components[0].components[0].options.find(o => o.default === true).default = false : null
context.params.event.message.components[0].components[0].options.find(o => o.value === type).default = true
if (type === 'mod') {
  embeds[0].fields = [
    {
      name: `kick`,
      value: `kick a member from the server`,
      inline: true
    },
    {
      name: `ban`,
      value: `ban a member from the server`,
      inline: true
    },
    {
      name: `mute`,
      value: `mute a member in the server`,
      inline: true
    },
    {
      name: `unmute`,
      value: `unmute a member in the server`,
      inline: true
    },
    {
      name: `warn`,
      value: `warn a user in the server`,
      inline: true
    },
    {
      name: `report`,
      value: `report a user in the server`,
      inline: true
    },
  ]
}else if (type === 'eco') {
  embeds[0].fields = [
    {
      name: `start`,
      value: `start the game`,
      inline: true
    },
    {
      name: `balance`,
      value: `check your balance or someone else's`,
      inline: true
    },
    {
      name: `give`,
      value: `give coins to someone`,
      inline: true
    },
    {
      name: `deposite`,
      value: `add coins to your bank`,
      inline: true
    },
    {
      name: `withdraw`,
      value: `take coins from your bank`,
      inline: true
    },
    {
      name: `find`,
      value: `find coins from some place`,
      inline: true
    },
    {
      name: `rob`,
      value: `try to rob someone`,
      inline: true
    },
    {
      name: `leaderboard`,
      value: `check the leaderboard`,
      inline: true
    },
  ]
}else if (type === 'setup') {
  embeds[0].fields = [
    {
      name: `setPrefix`,
      value: `change the server's prefix`,
      inline: true
    },
    {
      name: `setMuteRole`,
      value: `set a mute role for the server`,
      inline: true
    },
    {
      name: `setWelcomeChannel`,
      value: `set a welcome channel for the server`,
      inline: true
    },
    {
      name: `setLogChannel`,
      value: `set a log channel for the server`,
      inline: true
    },
  ]
}else if (type === 'music') {
  embeds[0].fields = [
    {
      name: `play`,
      value: `play a music from its name/link`,
      inline: true
    },
    {
      name: `pause`,
      value: `pause the current playing music`,
      inline: true
    },
    {
      name: `resume`,
      value: `resume the paused music`,
      inline: true
    },
    {
      name: `skip`,
      value: `skip to the next music in queue`,
      inline: true
    },
    {
      name: `disconnect`,
      value: `disconnect me from a vc`,
      inline: true
    },
    {
      name: `queue`,
      value: `check the queue or the current playing track`,
      inline: true
    },
  ]
}else if (type === 'level') {
  embeds[0].fields = [
    {
      name: `level`,
      value: `check your level or someone else's`,
      inline: true
    },
    {
      name: `leaderboard`,
      value: `check the leaderboard`,
      inline: true
    },
  ]
}
await lib.discord.channels['@0.3.0'].messages.update({
  message_id: `${context.params.event.message.id}`,
  channel_id: `${context.params.event.message.channel_id}`,
  embeds: embeds,
  components: context.params.event.message.components
});