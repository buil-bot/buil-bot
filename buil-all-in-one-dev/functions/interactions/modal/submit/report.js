const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const interaction = require('autocode-discord-interaction')

let d = await lib.googlesheets.query['@0.3.0'].select({//ok
  range: `guild!A:G`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      guild_id__is: `${context.params.event.guild_id}`,
    },
  ],
});
let channel = d.rows?.[0]?.fields?.log_ch_id;
if (channel === 'null') channel = null;

if (channel) {
  let title = context.params.event.data.components.find(c => c.components[0].custom_id === 'title')?.components[0]?.value
  let user = context.params.event.data.components.find(c => c.components[0].custom_id === 'user')?.components[0]?.value
  let description = context.params.event.data.components.find(c => c.components[0].custom_id === 'description')?.components[0]?.value
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${channel}`,
    content: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `${title}`,
        description: ``,
        color: 0xf3f3f3,
        fields: [
          {
            name: `User`,
            value: `${user}`,
            inline: false,
          },
          {
            name: `Report`,
            value: `${description}`,
            inline: false,
          },
        ],
        author: {
          name: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`,
        },
      },
    ],
  });
  await interaction.followup.create(context.params.event, {
    content: 'report submitted successfully!'
  },{ephemeral:true})
}else {
  await interaction.followup.create(context.params.event, {
    content: 'opse! no log channel found.'
  },{ephemeral:true})
}