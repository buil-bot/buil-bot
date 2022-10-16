const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  let eco_data = await lib.googlesheets.query['@0.3.0'].select({
    range: `eco!A:E`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'guild_ids__contains': `${event.guild_id}`
      }
    ],
  });
  let level_data = await lib.googlesheets.query['@0.3.0'].select({
    range: `user!A:D`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'guild_ids__contains': `${event.guild_id}`
      }
    ],
  });
  let embeds = []
  if (eco_data.rows[0]) {
    eco_data.rows.sort((a,b) => {
      return parseInt(b.fields.balance) - parseInt(a.fields.balance)
    });
    let fields = []
    for (let i = 0; i < eco_data.rows.slice(0,10).length; i++) {
      let userName = `${i+1}. ${await getUsername(eco_data.rows[i].fields.user_id)}`
      let userValue = `${eco_data.rows[i].fields.balance} coins`;
      fields.push({ name: userName, value: userValue })
    }
    embeds.push({
      title: `Eco leaderboard`,
      color: 0x00ff00,
      fields: fields
    })
  }
  if (level_data.rows[0]) {
    level_data.rows.sort((a,b) => {
      return parseInt(JSON.parse(b.fields.xp)[`${event.guild_id}`]) - parseInt(JSON.parse(a.fields.xp)[`${event.guild_id}`])
    });
    let fields = []
    for (let i = 0; i < level_data.rows.slice(0,10).length; i++) {
      let userName = `${i+1}. ${await getUsername(level_data.rows[i].fields.user_id)}`
      let userValue = `Level - ${Math.floor(JSON.parse(level_data.rows[i].fields.xp)[`${event.guild_id}`]/20)}\nXP - ${JSON.parse(level_data.rows[i].fields.xp)[`${event.guild_id}`]}`;
      fields.push({ name: userName, value: userValue })
    }
    embeds.push({
      title: `Level leaderboard`,
      color: 0x00ff00,
      fields: fields
    })
  }
  if (embeds.length) {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: ``,
      embeds: embeds,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }else {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `there are not enought user to display a leaderboard.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}
async function getUsername (id) {
  let user = await lib.discord.users['@0.2.0'].retrieve({
    user_id: `${id}`
  });
  return user.username
}