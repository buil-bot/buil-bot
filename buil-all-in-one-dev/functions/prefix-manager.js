const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const guildData = require('../helpers/guildData.js')

if (!context.params.event.guild_id) return 

let d = await guildData(context.params.event)
let command_prefix = d.rows?.[0]?.fields?.prefix ?? process.env.default_prefix
if (command_prefix === 'null') command_prefix = process.env.default_prefix
context.params.event.prefix = command_prefix.toLowerCase()
context.params.event.guild_data = d.rows[0].fields
let message = context.params.event.content.toLowerCase()

let mod_commands = ['kick','ban','mute','unmute','report','warn']
let eco_commands = ['start','balance','give','deposite','withdraw','rob','find']
let setup_commands = ['setprefix','setmuterole','setwelcomechannel','setlogchannel']
let music_commands = ['play','pause','resume','skip','disconnect','queue']

if (mod_commands.includes(message.split(' ')[0].replace(command_prefix,''))) {
  await require(`../prefix-commands/mod/${message.split(' ')[0].replace(command_prefix,'')}.js`)(context.params.event)
}else if (eco_commands.includes(message.split(' ')[0].replace(command_prefix,''))) {
  await require(`../prefix-commands/eco/${message.split(' ')[0].replace(command_prefix,'')}.js`)(context.params.event)
}else if (setup_commands.includes(message.split(' ')[0].replace(command_prefix,''))) {
  await require(`../prefix-commands/setup/${message.split(' ')[0].replace(command_prefix,'')}.js`)(context.params.event)
}else if (music_commands.includes(message.split(' ')[0].replace(command_prefix,''))) {
  await require(`../prefix-commands/music/${message.split(' ')[0].replace(command_prefix,'')}.js`)(context.params.event)
}else if (message.startsWith(`${command_prefix}level`)) {
  await require(`../prefix-commands/level.js`)(context.params.event)
}else if (message.startsWith(`${command_prefix}leaderboard`)) {
  await require(`../prefix-commands/leaderboard.js`)(context.params.event)
}else if (message.startsWith(`${command_prefix}help`) || message.startsWith(`${process.env.default_prefix}help`)) {
  await require(`../prefix-commands/help.js`)(context.params.event)
}
await require('../helpers/levels-manager.js')(context.params.event)

