const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let data = await lib.googlesheets.query['@0.3.0'].select({
  range: `guild!A:H`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'guild_id__is': `${context.params.event.guild_id}`
    }
  ],
});
if (!data.rows[0]) {
  data = await lib.googlesheets.query['@0.3.0'].insert({
    range: `guild!A:H`,
    fieldsets: [
      {
        'guild_id': `${context.params.event.guild_id}`,
        'mute_role': `null`,
        'log_ch_id': `null`,
        'welcome_ch_id': 'null',
        'music_ch_id': 'null',
        'prefix': `null`,
        'vc': `{}`
      }
    ]
  });
}
let vc = JSON.parse(data.rows[0].fields.vc)
vc[`${context.params.event.user_id}`] = context.params.event.channel_id
await lib.googlesheets.query['@0.3.0'].update({
  range: `guild!A:H`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'guild_id__is': `${context.params.event.guild_id}`
    }
  ],
  fields: {
    'vc': JSON.stringify(vc)
  }
});
let bot = await lib.discord.users['@0.2.0'].me.list();
if (context.params.event.user_id === bot.id && !context.params.event.channel_id) {
  const music = require('../helpers/music-manager.js')
  await music.clear_queue(context.params.event)
}