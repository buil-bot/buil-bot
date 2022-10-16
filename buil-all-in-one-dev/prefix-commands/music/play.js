const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const music = require('../../helpers/music-manager.js')
const yts = require('yt-search');

module.exports = async (event) => {
  await lib.discord.channels['@0.3.0'].typing.create({
    channel_id: `${event.channel_id}`,
  });
  let query = event.content?.split(' ')?.slice(1)?.join(' ') ?? ''
  if (!query.length) return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${event.channel_id}`,
    content: `please provide a search term, \`${event.prefix}play <search-term>\`.`,
    message_reference: {
      'message_id': `${event.id}`
    }
  });
  let channel = JSON.parse(event.guild_data.vc)[`${event.author.id}`]
  if (channel) {
    let track = await lib.discord.voice['@0.0.1'].tracks.retrieve({
      guild_id: `${event.guild_id}`,
    });
    if (track.channel_id && track.channel_id !== channel) return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `already playing music in <#${track.channel_id}>.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
    if (track.media_url) {
      let link = await yts(`${query}`)
      if (!link.all[0]) return lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${event.channel_id}`,
        content: `no result found for \`${query}\`.`,
        message_reference: {
          'message_id': `${event.id}`
        }
      });
      let q = await music.add_queue(event, link.all[0])
      if (!q.error) {
        await lib.discord.channels['@0.3.0'].messages.create({
          channel_id: `${event.channel_id}`,
          content: ``,
          embeds: [
            {
              type: 'rich',
              title: `Queue added!`,
              description: `[${link.all[0].title}](${link.all[0].url}) [<@${event.author.id}>]`, 
              color: 0x00ff00,
            },
          ],
          message_reference: {
            'message_id': `${event.id}`
          }
        });
      }else {
        await lib.discord.channels['@0.3.0'].messages.create({
          channel_id: `${event.channel_id}`,
          content: `opse! something went wrong while adding the music to queue.`,
          message_reference: {
            'message_id': `${event.id}`
          }
        });
      }
    }else {
      let link = await yts(`${query}`)
      if (!link.all[0]) return lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${event.channel_id}`,
        content: `no result found for \`${query}\`.`,
        message_reference: {
          'message_id': `${event.id}`
        }
      });
      let player = await music.play(event.guild_id, link.all[0].url, channel)
      if (player.channel_id) {
        await lib.discord.channels['@0.3.0'].messages.create({
          channel_id: `${event.channel_id}`,
          content: ``,
          embeds: [
            {
              type: 'rich',
              description: `Playing [${link.all[0].title}](${link.all[0].url}) in <#${player.channel_id}>:`,
              color: player.paused ? 0xff0000 : 0x00ff00,
              thumbnail: {
                url: `${link.all[0].thumbnail}`,
              },
              fields: [
                {
                  name: `Duration`,
                  value: `${link.all[0].timestamp}`,
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
        await lib.discord.channels['@0.3.0'].messages.create({
          channel_id: `${event.channel_id}`,
          content: `opse! something went wrong while playing the music.`,
          message_reference: {
            'message_id': `${event.id}`
          }
        });
      }
    }
  }else {
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: `you must join a voice channel to use this.`,
      message_reference: {
        'message_id': `${event.id}`
      }
    });
  }
}