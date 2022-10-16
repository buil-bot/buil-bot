const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const getData = require('../../helpers/ecoData.js');

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`,
  });
  let data = await getData(event);
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `where do you want to find money?`,
    components: [
      {
        type: 1,
        components: [
          {
            style: 2,
            label: `Place 1`,
            custom_id: `eco-find-1`,
            disabled: false,
            type: 2,
          },
          {
            style: 2,
            label: `Place 2`,
            custom_id: `eco-find-2`,
            disabled: false,
            type: 2,
          },
          {
            style: 2,
            label: `Place 3`,
            custom_id: `eco-find-3`,
            disabled: false,
            type: 2,
          },
          {
            style: 2,
            label: `Place 4`,
            custom_id: `eco-find-4`,
            disabled: false,
            type: 2,
          },
          {
            style: 2,
            label: `Place 5`,
            custom_id: `eco-find-5`,
            disabled: false,
            type: 2,
          },
        ],
      },
    ],
    message_reference: {
      message_id: `${event.id}`,
    },
  });
};
