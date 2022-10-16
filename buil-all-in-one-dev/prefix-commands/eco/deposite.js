const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const getData = require('../../helpers/ecoData.js')

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  let data = await getData(event)
  let amount = parseInt(event.content.split(' ')[1])
  if (!amount) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `please give a valid number for amount, \`${event.prefix}deposite <amount>\`.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  if (amount <= data.rows[0].fields.balance) {
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
        'bank_balance': `${parseInt(data.rows[0].fields.bank_balance) + amount}`
      }
    });
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `successfully deposited ${amount} into your bank.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }else {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `you don't have enough coins.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}