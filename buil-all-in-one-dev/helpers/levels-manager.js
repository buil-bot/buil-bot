const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const userData = require('./userData.js')

module.exports = async (event) => {
  let data = await userData(event)
  let xp_json = JSON.parse(data.rows[0].fields.xp)
  let xp = xp_json?.[`${event.guild_id}`] ?? 0
  let level = Math.floor(xp/20)
  let new_xp = xp + 1//giving 1 xp for each message
  xp_json[`${event.guild_id}`] = new_xp
  let new_level = Math.floor(new_xp/20)
  await lib.googlesheets.query['@0.3.0'].update({
    range: `user!A:D`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'user_id__is': `${event.author.id}`
      }
    ],
    fields: {
      'xp': JSON.stringify(xp_json)
    }
  });
  if (new_level > level) {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `congrats! you moved up a level, your new level is \`${new_level}\``,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}