const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const interaction = require('autocode-discord-interaction')
const guild_data = await require('../../../helpers/guildData.js')(context.params.event)

await interaction.callback.command_defer(context.params.event)
let command = context.params.event.data.options[0].name
let user = context.params.event.data.options[0].options.find(o => o.name === 'user')?.value
let reason = context.params.event.data.options[0].options.find(o => o.name === 'reason')?.value
if (user === context.params.event.member.user.id) return interaction.followup.edit_original(context.params.event, {
  content: `you can't perform this action to yourself.`
})
if (command === 'kick') {
  let can_use  = (context.params.event.member.permissions & (1 << 1)) === (1 << 1)
  if (!can_use) return interaction.followup.edit_original(context.params.event, {
    content: `sorry, you don't have permission to use this command!`
  })
  try {
    await lib.discord.guilds['@0.2.2'].members.destroy({
      user_id: `${user}`,
      guild_id: `${event.guild_id}`
    });
    content = `successfully kicked the user!`
    if (guild_data.rows[0].fields.log_ch_id !== 'null') {
      try {
        let embeds = [
          {
            type: `rich`,
            title: `Kick log`,
            description: ``,
            color: 0x00ff00,
            fields: [
              {
                name: `kicked`,
                value: `<@!${user}>`,
                inline: true
              },
              {
                name: `By`,
                value: `<@!${context.params.event.member.user.id}>`,
                inline: true
              },
            ]
          }
        ]
        if (reason?.length) embeds[0].fields.push({
          name: `Reason`,
          value: `${reason}`
        })
        await lib.discord.channels['@0.3.0'].messages.create({
          channel_id: `${guild_data.rows[0].fields.log_ch_id}`,
          content: ``,
          embeds: embeds
        });
      }catch(e) {}
    }else content = content.concat(`\nTip: Add a log channel where every single action will be logged. \`/setup log-channel\``)
    await interaction.followup.edit_original(context.params.event, {
      content: content
    })
  }catch(e) {
    await interaction.followup.edit_original(context.params.event, {
      content: `opse! something went wrong.`
    })
  }
}else if (command === 'ban') {
  let can_use  = (context.params.event.member.permissions & (1 << 2)) === (1 << 2)
  if (!can_use) return interaction.followup.edit_original(context.params.event, {
    content: `sorry, you don't have permission to use this command!`
  })
  try {
    await lib.discord.guilds['@0.2.2'].bans.create({
      user_id: `${user}`,
      guild_id: `${context.params.event.guild_id}`,
      reason: reason ?? ''
    });
    content = `successfully banned the user!`
    if (guild_data.rows[0].fields.log_ch_id !== 'null') {
      try {
        let embeds = [
          {
            type: `rich`,
            title: `Ban log`,
            description: ``,
            color: 0x00ff00,
            fields: [
              {
                name: `banned`,
                value: `<@!${user}>`,
                inline: true
              },
              {
                name: `By`,
                value: `<@!${context.params.event.member.user.id}>`,
                inline: true
              },
            ]
          }
        ]
        if (reason?.length) embeds[0].fields.push({
          name: `Reason`,
          value: `${reason}`
        })
        await lib.discord.channels['@0.3.0'].messages.create({
          channel_id: `${guild_data.rows[0].fields.log_ch_id}`,
          content: ``,
          embeds: embeds
        });
      }catch(e) {}
    }else content = content.concat(`\nTip: Add a log channel where every single action will be logged. \`/setup log-channel\``)
    await interaction.followup.edit_original(context.params.event, {
      content: content
    })
  }catch(e) {
    await interaction.followup.edit_original(context.params.event, {
      content: `opse! something went wrong.`
    })
  }
}else if (command === 'mute') {
  let can_use  = (context.params.event.member.permissions & (1 << 26)) === (1 << 26)
  if (!can_use) return interaction.followup.edit_original(context.params.event, {
    content: `sorry, you don't have permission to use this command!`
  })
  try {
    await lib.discord.guilds['@0.2.2'].members.roles.update({
      role_id: `${context.params.guild_data.rows[0].fields.mute_role}`,
      user_id: `${user}`,
      guild_id: `${event.guild_id}`
    });
    content = `successfully muted the user!`
    if (guild_data.rows[0].fields.log_ch_id !== 'null') {
      try {
        let embeds = [
          {
            type: `rich`,
            title: `Mute log`,
            description: ``,
            color: 0x00ff00,
            fields: [
              {
                name: `muted`,
                value: `<@!${user}>`,
                inline: true
              },
              {
                name: `By`,
                value: `<@!${event.member.user.id.id}>`,
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
          channel_id: `${guild_data.rows[0].fields.log_ch_id}`,
          content: ``,
          embeds: embeds
        });
      }catch(e) {}
    }else content = content.concat(`\nTip: Add a log channel where every single action will be logged. \`/setup log-channel\``)
    await interaction.followup.edit_original(context.params.event, {
      content: content
    })
  }catch(e) {
    await interaction.followup.edit_original(context.params.event, {
      content: `opse! something went wrong.`
    })
  }
}else if (command === 'unmute') {
  let can_use  = (context.params.event.member.permissions & (1 << 26)) === (1 << 26)
  if (!can_use) return interaction.followup.edit_original(context.params.event, {
    content: `sorry, you don't have permission to use this command!`
  })
  try {
    await lib.discord.guilds['@0.2.2'].members.roles.destroy({
      role_id: `${context.params.guild_data.rows[0].fields.mute_role}`,
      user_id: `${user}`,
      guild_id: `${event.guild_id}`
    });
    content = `successfully unmuted the user!`
    if (guild_data.rows[0].fields.log_ch_id !== 'null') {
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
                value: `<@!${user}>`,
                inline: true
              },
              {
                name: `By`,
                value: `<@!${event.member.user.id.id}>`,
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
          channel_id: `${guild_data.rows[0].fields.log_ch_id}`,
          content: ``,
          embeds: embeds
        });
      }catch(e) {}
    }else content = content.concat(`\nTip: Add a log channel where every single action will be logged. \`/setup log-channel\``)
    await interaction.followup.edit_original(context.params.event, {
      content: content
    })
  }catch(e) {
    await interaction.followup.edit_original(context.params.event, {
      content: `opse! something went wrong.`
    })
  }
}else if (command === 'report') {
  await interaction.followup.edit_original(context.params.event, {
    components: [
      {
        type: 1,
        components: [
          {
            style: 4,
            label: `Report`,
            custom_id: `rep`,
            disabled: false,
            type: 2,
          },
        ],
      },
    ],
    embeds: [
      {
        type: 'rich',
        title: `Report`,
        description: `Report a user!`,
        color: 0x00ffff,
      },
    ],
  })
}else if (command === 'warn') {
  let can_use  = (context.params.event.member.permissions & (1 << 40)) === (1 << 40)
  if (!can_use) return interaction.followup.edit_original(context.params.event, {
    content: `sorry, you don't have permission to use this command!`
  })
  let data = await require('../../../helpers/userData.js')(context.params.event, null, true)
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
  await interaction.followup.edit_original(context.params.event, {
    content: `<@!${warn_user}> you have been warned, this is your ${new_warn} time.`
  })
  if (guild_data.rows[0].fields.log_ch_id !== 'null') {
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
              value: `<@!${user}>`,
              inline: true
            },
            {
              name: `By`,
              value: `<@!${event.member.user.id}>`,
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
        channel_id: `${guild_data.rows[0].fields.log_ch_id}`,
        content: ``,
        embeds: embeds
      });
    }catch(e) {console.log(e)}
  }
}else {
  await interaction.followup.edit_original(context.params.event, {
    content: 'unknown command'
  })
}