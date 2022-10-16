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
  let prefix = event.content?.split(' ')?.[1]
  if (!prefix || !prefix.length) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `Please provide a new prefix.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  try {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `A:H`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'guild_id__is': `${event.guild_id}`
        }
      ],
      fields: {
        'prefix': `${prefix}`
      }
    });
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `prefix for this serevr has been updated to \`${prefix}\``,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }catch(e){
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `an unknown error occured while changing my prefix.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}