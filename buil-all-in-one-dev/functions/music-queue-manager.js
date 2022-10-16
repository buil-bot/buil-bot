const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const music = require('../helpers/music-manager.js')

let queue = await music.remove_queue(context.params.event)
if (queue.length) {
  let m = await music.play(context.params.event.guild_id, queue[0].link, context.params.event.channel_id)
  if (m.error) console.log(`something went wrong is the queue`);
}
