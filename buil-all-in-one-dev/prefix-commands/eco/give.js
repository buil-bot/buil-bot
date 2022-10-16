const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const getData = require('../../helpers/ecoData.js')

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  if (!event.mentions.length) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `mention a user to give coins.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  let amount = parseInt(event.content.split(' ')[2])
  try {
    let u = await lib.discord.guilds['@0.2.1'].members.retrieve({
      user_id: `${event.mentions[0].id}`,
      guild_id: `${event.guild_id}`
    });
    if (u.user.bot) {
      return lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${event.channel_id}`,
        content: `You cannot give coins to a bot.`,
        message_reference: {
          'message_id': `${event.id}`
        }
      });
    }else if(u.user.id === event.author.id) {
      return lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${event.channel_id}`,
        content: `You cannot give coins to yourself.`,
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
  if (!amount) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `please give a valid number for amount, \`${event.prefix}give <@user> <amount>\`.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  
  let data = await getData(event)
  if (amount <= data.rows[0].fields.balance) {
    //user has enough coins
    let data2 = await getData(event, event.mentions[0].id)
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${event.author.id}`
        }
      ],
      fields: {
        'balance': `${parseInt(data.rows[0].fields.balance) - amount}`,
      }
    });
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:F`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${event.mentions[0].id}`
        }
      ],
      fields: {
        'balance': `${parseInt(data2.rows[0].fields.balance) + amount}` 
      }
    });
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `you gave <@!${event.mentions[0].id}> ${amount} coins.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }else {
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `you don't have enough coins.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}