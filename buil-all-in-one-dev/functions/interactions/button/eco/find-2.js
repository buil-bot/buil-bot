const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const interaction = require('autocode-discord-interaction')
const getData = require('../../../../helpers/ecoData.js')

let user = context.params.event.message.mentions?.[0]?.id ?? context.params.event.message?.interaction?.user?.id
if (user !== context.params.event.member.user.id) {
    await interaction.callback.component_defer(context.params.event)
    return interaction.followup.create(context.params.event,{
      content: 'this is not your button'
    })
  }
let data = await getData(context.params.event, null, true)
context.params.event.message.components[0].components.find(c => c.custom_id === context.params.event.data.custom_id).style = 3
context.params.event.message.components[0].components.forEach(c => {c.disabled = true})
let amount = Math.floor(Math.random() * 200)
let replies = [
  `You found ₹${amount} at ${context.params.event.message.components[0].components.find(c => c.custom_id === context.params.event.data.custom_id).label}.`,
  `You searched at ${context.params.event.message.components[0].components.find(c => c.custom_id === context.params.event.data.custom_id).label}, and found nothing.`
]
let reply = replies[Math.floor(Math.random()* replies.length)]
if (reply.includes(`${amount}`)) {
  await lib.googlesheets.query['@0.3.0'].update({
    range: `eco!A:E`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'user_id__is': `${context.params.event.member.user.id}`
      }
    ],
    fields: {
      'balance': `${parseInt(data.rows[0].fields.balance) + amount}`
    }
  });
}
await lib.discord.channels['@0.3.0'].messages.update({
  message_id: `${context.params.event.message.id}`,
  channel_id: `${context.params.event.message.channel_id}`,
  content: `${reply}`,
  components: context.params.event.message.components
});


