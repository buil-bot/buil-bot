const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (event, user_id, interaction) => {
  user = user_id ?? event?.author?.id
  if (interaction) user = user_id ?? event?.member?.user?.id
  let data = await lib.googlesheets.query['@0.3.0'].select({
    range: `user!A:D`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'user_id__is': `${user}`
      }
    ],
  });
  if (!data.rows[0]) {
    data =await lib.googlesheets.query['@0.3.0'].insert({
      range: `user!A:D`,
      fieldsets: [
        {
          'user_id': `${user}`,
          'guild_ids': `${event.guild_id}`,
          'xp': `{}`,
          'warn': `{}`
        }
      ]
    });
  }else {
    if (!data.rows[0].fields.guild_ids.toString().includes(`${event.guild_id}`)) {
      await lib.googlesheets.query['@0.3.0'].update({
        range: `user!A:D`,
        bounds: 'FIRST_EMPTY_ROW',
        where: [
          {
            'user_id__is': `${user}`
          }
        ],
        fields: {
          'guild_ids': `${data.rows[0].fields.guild_ids.toString().concat(` ${event.guild_id}`)}`
        }
      });
    }
  }
  return data
}