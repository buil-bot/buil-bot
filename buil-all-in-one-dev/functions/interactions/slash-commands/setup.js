const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const interaction = require('autocode-discord-interaction')

await interaction.callback.command_defer(context.params.event)
let command = context.params.event.data.options[0].name

let can_use  = (context.params.event.member.permissions & (1 << 5)) === (1 << 5)
if (!can_use) return interaction.followup.edit_original(context.params.event, {
  content: `sorry, you don't have permission to use this command!`
})
if (command === 'prefix') {
  let prefix = context.params.event.data.options[0]?.options?.find(o => o.name === 'prefix')?.value
  try {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `A:H`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'guild_id__is': `${context.params.event.guild_id}`
        }
      ],
      fields: {
        'prefix': `${prefix}`
      }
    });
    await interaction.followup.edit_original(context.params.event, {
      content: `prefix for this serevr has been updated to \`${prefix}\``
    })
  }catch(e){
    return interaction.followup.edit_orignal(context.params.event, {
      content: `an unknown error occured while changing my prefix.`
    })
  }
}else if (command === 'log-channel') {
  let channel = context.params.event.data.options[0]?.options?.find(o => o.name === 'channel')?.value
  let ch 
  try {
    ch = await lib.discord.channels['@0.3.0'].retrieve({
      channel_id: channel
    });
  }catch(e){}
  if (ch?.guild_id !== event.guild_id) return interaction.followup.edit_original(context.params.event, {
    content: `unknown channel`
  })
  try {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${ch.id}`,
      content: `this channel has been set as my log channel.`
    });
    await lib.googlesheets.query['@0.3.0'].update({
      range: `A:H`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'guild_id__is': `${context.params.event.guild_id}`
        }
      ],
      fields: {
        'log_ch_id': `${ch.id}`
      }
    });
    await interaction.followup.edit_original(context.params.event, {
      content: `log channel has been set to <#${ch.id}>`
    })
  }catch(e){
    if (e.message.includes('Missing Permissions')) {
      return interaction.followup.edit_original(context.params.event, {
        content: `I am missing permission for that channel`
      })
    }else {
      return interaction.followup.edit_original(context.params.event, {
        content: `an unknown error occured while setting the log channel.`
      })
    }
  }
}else if (command === 'welcome-channel') {
  let channel = context.params.event.data.options[0]?.options?.find(o => o.name === 'channel')?.value
  let ch 
  try {
    ch = await lib.discord.channels['@0.3.0'].retrieve({
      channel_id: channel
    });
  }catch(e){}
  if (ch?.guild_id !== event.guild_id) return interaction.followup.edit_original(context.params.event, {
    content: `unknown channel`
  })
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
          'guild_id__is': `${context.params.event.guild_id}`
        }
      ],
      fields: {
        'log_ch_id': `${ch.id}`
      }
    });
    await interaction.followup.edit_original(context.params.event, {
      content: `welcome channel has been set to <#${ch.id}>`
    })
  }catch(e){
    if (e.message.includes('Missing Permissions')) {
      return interaction.followup.edit_original(context.params.event, {
        content: `I am missing permission for that channel`
      })
    }else {
      return interaction.followup.edit_original(context.params.event, {
        content: `an unknown error occured while setting the welcome channel.`
      })
    }
  }
}else if (command === 'mute-role') {
  let role = context.params.event.data.options[0]?.options?.find(o => o.name === 'role')?.value
  try {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `A:H`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'guild_id__is': `${context.params.event.guild_id}`
        }
      ],
      fields: {
        'mute_role': `${role}`
      }
    });
    await interaction.followup.edit_original(context.params.event, {
      content: `mute role has been set as \`${role.name}\``
    })
  }catch(e){
    return interaction.followup.edit_original(context.params.event, {
      content: `an unknown error occured while setting the mute role.`
    })
  }
}else {
  await interaction.followup.edit_original(context.params.event, {
    content: 'unknown command'
  })
}