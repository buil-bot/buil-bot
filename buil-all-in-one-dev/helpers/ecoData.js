const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (event, user_id, interaction) => {
  user = user_id ?? event?.author?.id
  if (interaction) user = user_id ?? event?.member?.user?.id
  let database = await lib.googlesheets.query['@0.3.0'].select({
    range: `eco!A:F`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'user_id__is': `${user}`
      }
    ],
  });
  if (database.rows[0]) {
    if (!database.rows[0].fields.guild_ids.toString().includes(`${event.guild_id}`)) {
      await lib.googlesheets.query['@0.3.0'].update({
        range: `eco!A:F`,
        bounds: 'FIRST_EMPTY_ROW',
        where: [
          {
            'user_id__is': `${user}`
          }
        ],
        fields: {
          'guild_ids': `${database.rows[0].fields.guild_ids.toString().concat(` ${event.guild_id}`)}`
        }
      });
    }
  }else {
    database = await lib.googlesheets.query['@0.3.0'].insert({
      range: `eco!A:F`,
      fieldsets: [
        {
          'user_id': `${user}`,
          'balance': 100,
          'bank_balance': 0,
          'guild_ids': `${event.guild_id}`,
          'inventory': `null`
        }
      ]
    });
    database.new_user = true
  }
  return database
}