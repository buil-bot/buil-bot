const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (event) => {
  let d = await lib.googlesheets.query['@0.3.0'].select({
    range: `guild!A:H`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'guild_id__is': `${event.guild_id}`
      }
    ],
  });
  if (!d.rows[0]) {
    d = await lib.googlesheets.query['@0.3.0'].insert({
      range: `guild!A:H`,
      fieldsets: [
        {
          'guild_id': `${event.guild_id}`,
          'mute_role': `null`,
          'log_ch_id': `null`,
          'welcome_ch_id': 'null',
          'prefix': `null`,
          'vc': `{}`,
          'music_queue': '[]'
        }
      ]
    });
  }
  return d
}