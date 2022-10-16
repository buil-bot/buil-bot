const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let checkPerm = require('../../helpers/checkPerm.js')

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  let canUse = await checkPerm(event,(1 << 26))//checking if the user has manage roles permission
  if (!canUse) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `sorry, you dont have the permission to use this command.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  if (event.guild_data.mute_role === 'null') return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `please provide a mute role before using this command, \`${event.prefix}setMuteRole\`.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  let unmute_user = event.mentions?.[0]?.id
  let reason = event.content.split(' ')?.slice(2)?.join(' ') ?? ''
  if (!unmute_user) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `please mention a user to unmute.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  try {
    await lib.discord.guilds['@0.2.2'].members.roles.destroy({
      role_id: `${event.guild_data.mute_role}`,
      user_id: `${unmute_user}`,
      guild_id: `${event.guild_id}`
    });
    content = `successfully unmuted the user!`
    if (event.guild_data.log_ch_id !== 'null') {
      try {
        let embeds = [
          {
            type: `rich`,
            title: `Mute log`,
            description: ``,
            color: 0x00ff00,
            fields: [
              {
                name: `unmuted`,
                value: `<@!${unmute_user}>`,
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
    }else content = content.concat(`\nTip: Add a log channel where every single action will be logged. \`${event.prefix}setLogChannel\``)
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