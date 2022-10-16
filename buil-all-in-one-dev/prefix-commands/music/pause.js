const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const music = require('../../helpers/music-manager.js')

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
      if (track.paused) {
        return lib.discord.channels['@0.3.0'].messages.create({
          channel_id: `${event.channel_id}`,
          content: `the track is already paused.`,
          message_reference: {
            'message_id': `${event.id}`
          }
        });
      }else {
        await lib.discord.voice['@0.0.1'].tracks.pause({
          guild_id: `${event.guild_id}`
        });
        return lib.discord.channels['@0.3.0'].messages.create({
          channel_id: `${event.channel_id}`,
          content: `paused the track in <#${track.channel_id}>.`,
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