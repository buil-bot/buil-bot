const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let checkPerm = require('../../helpers/checkPerm.js')
let userData = require('../../helpers/userData.js')

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  let canUse = await checkPerm(event,(1 << 40))//checking if the user has moderate member permission
  if (!canUse) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `sorry, you dont have the permission to use this command.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  let warn_user = event.mentions?.[0]?.id
  let reason = event.content.split(' ')?.slice(2)?.join(' ') ?? ''
  if (!warn_user) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `please mention a user to ban.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  let data = await userData(event)
  let warn_json = JSON.parse(data.rows[0].fields.warn)
  let warn = warn_json?.[`${event.guild_id}`] ?? 0
  let new_warn = warn + 1
  warn_json[`${event.guild_id}`] = new_warn
  await lib.googlesheets.query['@0.3.0'].update({
    range: `user!A:D`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'user_id__is': `${warn_user}`
      }
    ],
    fields: {
      'warn': JSON.stringify(warn_json)
    }
  });
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `<@!${warn_user}> you have been warned, this is your ${new_warn} time.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  if (event.guild_data.log_ch_id !== 'null') {
    try {
      let embeds = [
        {
          type: `rich`,
          title: `Warn log`,
          description: ``,
          color: 0x00ff00,
          fields: [
            {
              name: `warned`,
              value: `<@!${warn_user}>`,
              inline: true
            },
            {
              name: `By`,
              value: `<@!${event.author.id}>`,
              inline: true
            },
          ]
        }
      ]
      if (reason.length) embeds[0].fields.push({
        name: `Reason`,
        value: `${reason}`
      })
      await lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${event.guild_data.log_ch_id}`,
        content: ``,
        embeds: embeds
      });
    }catch(e) {console.log(e)}
  }
}