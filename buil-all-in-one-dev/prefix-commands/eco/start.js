const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const getData = require('../../helpers/ecoData.js')

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  let data = await getData(event)
  if (data.new_user) {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `welcome! <@!${event.author.id}>, here's your first ${data.rows[0].fields.balance} coins`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }else {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `you have already started.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}