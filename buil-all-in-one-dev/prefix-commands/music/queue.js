const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const music = require('../../helpers/music-manager.js')
const yts = require('yt-search');

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`,
  });
  let now_playing = await lib.discord.voice['@0.0.1'].tracks.retrieve({
    guild_id: `${event.guild_id}`
  });
  let queue = await music.get_queue(event)
  let embeds = []
  if (now_playing.media_url) {
    let video = await yts(now_playing.media_display_name)
    embeds.push({
      title: `Now playing`,
      description: `playing [${video.all[0].title}](${video.all[0].url}) in <#${now_playing.channel_id}>`,
      color: 0x00ff00,
      thumbnail: {
        url: `${video.all[0].thumbnail}`
      },
      fields: [
        {
          name: `Duration`,
          value: `${video.all[0].timestamp}`,
          inline: true,
        },
      ],
    })
  }
  if (queue.length) {
    embeds.push({
      title: 'Queue',
      description: queue.map((q,index) => `${index+1}. [${q.title}](${q.link}) [<@${q.user}>]`).join('\n'),
      color: 0x00ff00
    })
  }
  if (embeds.length) {
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: ``,
      embeds: embeds,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }else {
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `Nothing is in the queue.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}