const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const userData = require('../helpers/userData.js')

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  let user = await lib.discord.users['@0.2.0'].retrieve({
    user_id: event.mentions?.[0]?.id ?? event.author.id
  });
  if (user.bot) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `bots can't have levels.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  let user_data = await userData(event, user.id)
  if (user_data.rows[0] && user_data.rows[0].fields.guild_ids.includes(`${event.guild_id}`)) {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: ``,
      embeds: [
        {
          title: `${user.username}#${user.discriminator}`,
          description: `Level - ${Math.floor(JSON.parse(user_data.rows[0].fields.xp)[`${event.guild_id}`]/20)}\nXP - ${JSON.parse(user_data.rows[0].fields.xp)[`${event.guild_id}`]}`,
          color: 0x00ff00
        }
      ],
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }else {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `<@!${user.id}> haven't sent much messages, so no level data available`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}