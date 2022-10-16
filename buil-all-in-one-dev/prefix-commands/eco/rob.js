const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const getData = require('../../helpers/ecoData.js')

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  if (!event.mentions.length) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `mention a user to rob.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  try {
    let u = await lib.discord.guilds['@0.2.1'].members.retrieve({
      user_id: `${event.mentions[0].id}`,
      guild_id: `${event.guild_id}`
    });
    if (u.user.bot) {
      return lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${event.channel_id}`,
        content: `You cannot rob a bot.`,
        message_reference: {
          'message_id': `${event.id}`
        }
      });
    }else if(u.user.id === event.author.id) {
      return lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${event.channel_id}`,
        content: `You cannot rob yourself.`,
        message_reference: {
          'message_id': `${event.id}`
        }
      });
    }
  }catch(e) {
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `unknown user.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
  let user1 = await getData(event)
  let user2 = await getData(event, event.mentions[0].id)
  if (parseInt(user1.rows[0].fields.balance) < 500) {
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `you need to have atleast 500 coins to rob.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }else if (parseInt(user2.rows[0].fields.balance) > 500) {
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `the other user doesn't even have 500 coins, leave them alone.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
  let won_amount = Math.floor(Math.random() * 400)
  let lost_amount = Math.floor(Math.random() * 400)
  let replies = [
    `You got ${won_amount} coins by robbing <@!${event.mentions[0].id}>.`,
    `<@!${event.mentions[0].id}> caught you, you lost ${lost_amount} coins.`
  ]
  let reply = replies[Math.floor(Math.random()* replies.length)]
  if (reply.includes(`${won_amount}`)) {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${event.mentions[0].id}`
        }
      ],
      fields: {
        'balance': `${parseInt(user2.rows[0].fields.balance) - won_amount}`
      }
    });
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${event.author.id}`
        }
      ],
      fields: {
        'balance': `${parseInt(user1.rows[0].fields.balance) + won_amount}`
      }
    });
  }else if (reply.includes(`${lost_amount}`)) {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${event.mentions[0].id}`
        }
      ],
      fields: {
        'balance': `${parseInt(user2.rows[0].fields.balance) + lost_amount}`
      }
    });
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${event.author.id}`
        }
      ],
      fields: {
        'balance': `${parseInt(user1.rows[0].fields.balance) - lost_amount}`
      }
    });
  }
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `${reply}`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
} 