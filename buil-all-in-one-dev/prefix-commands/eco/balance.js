const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const getData = require('../../helpers/ecoData.js')

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  let user = await lib.discord.users['@0.2.0'].retrieve({
    user_id: event.mentions?.[0]?.id ?? event.author.id
  });
  if (user.bot) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `bots cant have accounts.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  let data = await getData(event,user.id)
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: ``,
    embeds: [
      {
        title: `${user.username}#${user.discriminator}`,
        color: 0x00ff00,
        fields: [
          {
            name: `Current balance`,
            value: `${data.rows[0]?.fields?.balance}`,
            inline: true
          },
          {
            name: `Bank balance`,
            value: `${data.rows[0]?.fields?.bank_balance}`,
            inline: true
          }
        ],
      }
    ],
    message_reference: {
      'message_id': `${event.id}`
    }
  });
}