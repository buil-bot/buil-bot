const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let checkPerm = require('../../helpers/checkPerm.js')

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  let canUse = await checkPerm(event,(1 << 2))//checking if the user has ban permission
  if (!canUse) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `sorry, you dont have the permission to use this command.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  let ban_user = event.mentions?.[0]?.id
  let reason = event.content.split(' ')?.slice(2)?.join(' ') ?? ''
  if (!ban_user) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `please mention a user to ban.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  if (ban_user === event.author.id) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `you can't ban yourself.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  try {
    await lib.discord.guilds['@0.2.2'].bans.create({
      user_id: `${ban_user}`,
      guild_id: `${event.guild_id}`,
      reason: `${reason}`
    });
    content = `successfully banned the user!`
    if (event.guild_data.log_ch_id !== 'null') {
      try {
        let embeds = [
          {
            type: `rich`,
            title: `ban log`,
            description: ``,
            color: 0x00ff00,
            fields: [
              {
                name: `banned`,
                value: `<@!${ban_user}>`,
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
      }catch(e) {}
    }else content = content.concat(`\nTip: Add a log channel where every single action will be logged. \`${event.prefix}setlogchannel\``)
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: content,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }catch(e) {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `opse! something went wrong.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}