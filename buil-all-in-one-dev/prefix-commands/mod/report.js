const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`
  });
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: '',
    tts: false,
    components: [
      {
        type: 1,
        components: [
          {
            style: 4,
            label: `Report`,
            custom_id: `rep`,
            disabled: false,
            type: 2,
          },
        ],
      },
    ],
    embeds: [
      {
        type: 'rich',
        title: `Report`,
        description: `Report a user!`,
        color: 0x00ffff,
      },
    ],
  });
};
