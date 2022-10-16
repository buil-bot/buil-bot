const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const interaction = require('autocode-discord-interaction')

await interaction.callback.form_modal(context.params.event, {
  custom_id: `report`,
  title: 'Report user',
  text_inputs: [
    {
      style: 'short',
      custom_id: 'title',
      label: `Subject`,
      min_length: 1,
      max_length: 128,
      placeholder: 'Enter a brief description of your report.',
      required: true
    },
    {
      style: 'short',
      custom_id: 'user',
      label: `User`,
      min_length: 1,
      max_length: 128,
      placeholder: 'Enter the username and discriminator of the user you want to report.',
      required: true
    },
    {
      style: 'long',
      custom_id: 'description',
      label: `Report`,
      min_length: 1,
      max_length: 4000,
      placeholder: 'Long description of your report.',
      required: true
    }
  ]
})