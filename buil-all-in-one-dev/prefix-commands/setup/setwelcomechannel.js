const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let checkPerm = require('../../helpers/checkPerm.js')

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  let canUse = await checkPerm(event,(1 << 5))//checking if the user has manage server permission
  if (!canUse) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `sorry, you dont have the permission to use this command.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  let mentioned_chs = event.content?.split(' ')[1]?.match(/<#[0-9]*>/g)
  if (!mentioned_chs || !mentioned_chs.length) mentioned_chs = [`${event.channel_id}`]
  let ch 
  try {
    ch = await lib.discord.channels['@0.3.0'].retrieve({
      channel_id: mentioned_chs[0]
    });
  }catch(e){}
  if (ch?.guild_id !== event.guild_id) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `unknown channel`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  try {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${ch.id}`,
      content: `this channel has been set as the welcome channel.`
    });
    await lib.googlesheets.query['@0.3.0'].update({
      range: `A:H`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'guild_id__is': `${event.guild_id}`
        }
      ],
      fields: {
        'welcome_ch_id': `${ch.id}`
      }
    });
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `welcome channel has been set to <#${ch.id}>`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }catch(e){
    if (e.message.includes('Missing Permissions')) {
      return lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${event.channel_id}`,
        content: `I am missing permission for that channel`,
        message_reference: {
          'message_id': `${event.id}`
        }
      });
    }else {
      return lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${event.channel_id}`,
        content: `an unknown error occured while setting the log channel.`,
        message_reference: {
          'message_id': `${event.id}`
        }
      });
    }
  }
}