const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let d = await lib.googlesheets.query['@0.3.0'].select({
  range: `guild!A:H`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'guild_id__is': `${context.params.event.guild_id}`
    }
  ],
});
if (!d.rows[0]) {
  d = await lib.googlesheets.query['@0.3.0'].insert({
    range: `guild!A:H`,
    fieldsets: [
      {
        'guild_id': `${context.params.event.guild_id}`,
        'mute_role': `null`,
        'log_ch_id': `null`,
        'welcome_ch_id': 'null',
        'music_ch_id': 'null',
        'prefix': `null`,
        'settings': JSON.stringify({})
      }
    ]
  });
}
let welcome_ch = d.rows?.[0]?.fields?.welcome_ch_id
if (welcome_ch === 'null') welcome_ch = null

if (welcome_ch) await lib.discord.channels['@0.3.0'].messages.create({
  channel_id: `${welcome_ch}`,
  content: `Welcome! <@${context.params.event.user.id}>` 
});