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
  let mentioned_role = event.mention_roles[0]
  if (!mentioned_role) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `please mention a role to be set as the mute role.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  let role
  try {
    role = await lib.discord.guilds['@0.2.2'].roles.list({
      guild_id: `${event.guild_id}`
    }).then(r => {
      return r.find(R => R.id === mentioned_role)
    })
  }catch(e){}
  if (!role) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `unknown role`,
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
        'mute_role': `${role.id}`
      }
    });
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `mute role has been set as \`${role.name}\``,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }catch(e){
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `an unknown error occured while setting the mute role.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}