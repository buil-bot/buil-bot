const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const interaction = require('autocode-discord-interaction')
const userData = require('../../../helpers/userData.js')

await interaction.callback.command_defer(context.params.event)
let command = context.params.event.data.options[0].name

if (command === 'check') {
  let user_id = context.params.event.data.options[0].options.find(o => o.name === 'user')?.value
  let user = await lib.discord.users['@0.2.0'].retrieve({
    user_id: user_id
  });
  if (user.bot) return interaction.followup.edit_original(context.params.event, {
    content: `bots can't have levels.`
  })
  let user_data = await userData(context.params.event, user.id)
  if (user_data.rows[0] && user_data.rows[0].fields.guild_ids.includes(`${context.params.event.guild_id}`)) {
    await interaction.followup.edit_original(context.params.event, {
      embeds: [
        {
          title: `${user.username}#${user.discriminator}`,
          description: `Level - ${Math.floor(JSON.parse(user_data.rows[0].fields.xp)[`${context.params.event.guild_id}`]/20)}\nXP - ${JSON.parse(user_data.rows[0].fields.xp)[`${context.params.event.guild_id}`]}`,
          color: 0x00ff00
        }
      ],
    })
  }else {
    await interaction.followup.edit_original(context.params.event, {
      content: `<@!${user.id}> haven't sent much messages, so no level data available`
    })
  }
}else if (command === 'leaderboard') {
  let level_data = await lib.googlesheets.query['@0.3.0'].select({
    range: `user!A:D`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'guild_ids__contains': `${context.params.event.guild_id}`
      }
    ],
  });
  let embeds = []
  if (level_data.rows[0]) {
    level_data.rows.sort((a,b) => {
      return parseInt(JSON.parse(b.fields.xp)[`${context.params.event.guild_id}`]) - parseInt(JSON.parse(a.fields.xp)[`${context.params.event.guild_id}`])
    });
    let fields = []
    for (let i = 0; i < level_data.rows.slice(0,10).length; i++) {
      let userName = `${i+1}. ${await getUsername(level_data.rows[i].fields.user_id)}`
      let userValue = `Level - ${Math.floor(JSON.parse(level_data.rows[i].fields.xp)[`${context.params.event.guild_id}`]/20)}\nXP - ${JSON.parse(level_data.rows[i].fields.xp)[`${context.params.event.guild_id}`]}`;
      fields.push({ name: userName, value: userValue })
    }
    embeds.push({
      title: `Level leaderboard`,
      color: 0x00ff00,
      fields: fields
    })
    if (embeds.length) {
      await interaction.followup.edit_original(context.params.event, {
        embeds: embeds
      })
    }else {
      await interaction.followup.edit_original(context.params.event, {
        content: `there are not enought user to display a leaderboard.`
      })
    }
  }
}else {
  await interaction.followup.edit_original(context.params.event, {
    content: `unknown command`
  })
}

async function getUsername (id) {
  let user = await lib.discord.users['@0.2.0'].retrieve({
    user_id: `${id}`
  });
  return user.username
}