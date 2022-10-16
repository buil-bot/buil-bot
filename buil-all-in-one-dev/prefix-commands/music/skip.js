const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const music = require('../../helpers/music-manager.js')
const yts = require('yt-search');

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`,
  });
  let channel = JSON.parse(event.guild_data.vc)[`${event.author.id}`]
  if (channel) {
    let track = await lib.discord.voice['@0.0.1'].tracks.retrieve({
      guild_id: `${event.guild_id}`,
    });
    if (!track.media_url) return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `currently not playing any music.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
    if (channel === track.channel_id) {
      let queue = await music.remove_queue(event)
      if (queue.length) {
        let m = await music.play(event.guild_id, queue[0].link, track.channel_id)
        if (m.error) return lib.discord.channels['@0.3.0'].messages.create({
          channel_id: `${event.channel_id}`,
          content: `opse! something went wrong`,
          message_reference: {
            'message_id': `${event.id}`
          }
        });
        let video = await yts(queue[0].link)
        await lib.discord.channels['@0.3.0'].messages.create({
          channel_id: `${event.channel_id}`,
          content: ``,
          embeds: [
            {
              type: 'rich',
              description: `skipped to [${video.all[0].title}](${video.all[0].url}) in <#${track.channel_id}>:`,
              color: 0x00ff00,
              thumbnail: {
                url: `${video.all[0].thumbnail}`,
              },
              fields: [
                {
                  name: `Duration`,
                  value: `${video.all[0].timestamp}`,
                  inline: true,
                },
              ],
            }
          ],
          message_reference: {
            'message_id': `${event.id}`
          }
        });
      }else {
        await lib.discord.voice['@0.0.1'].channels.disconnect({
          guild_id: `${event.guild_id}`
        });
        return lib.discord.channels['@0.3.0'].messages.create({
          channel_id: `${event.channel_id}`,
          content: `disconnected from <#${track.channel_id}> as there is no more music to play.`,
          message_reference: {
            'message_id': `${event.id}`
          }
        });
      }
    }else {
      await lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${event.channel_id}`,
        content: `you're not in the same vc as me.`,
        message_reference: {
          'message_id': `${event.id}`
        }
      });
    }
  }else {
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `you need to be in a vc to use this command.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}