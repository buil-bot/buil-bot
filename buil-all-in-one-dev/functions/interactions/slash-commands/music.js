const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const interaction = require('autocode-discord-interaction')
const guild_data = await require('../../../helpers/guildData.js')(context.params.event)
const yts = require('yt-search')
const music = require('../../../helpers/music-manager.js')

await interaction.callback.command_defer(context.params.event)
let command = context.params.event.data.options[0].name

let channel = JSON.parse(guild_data.rows[0].fields.vc)[`${context.params.event.member.user.id}`]
if (!channel) return interaction.followup.edit_original(context.params.event, {
  content: `you must join a voice channel to use this.`
})
if (command === 'play') {
  let query = context.params.event.data.options[0]?.options?.find(o => o.name === 'search-term')?.value
  let track = await lib.discord.voice['@0.0.1'].tracks.retrieve({
    guild_id: `${context.params.event.guild_id}`,
  });
  if (track.channel_id && track.channel_id !== channel) return interaction.followup.edit_original(context.params.event, {
    content: `already playing music in <#${track.channel_id}>.`
  })
  let link = await yts(`${query}`)
  if (!link.all[0]) return interaction.followup.edit_original(context.params.event, {
    content: `no result found for \`${query}\`.`
  })
  if (track.media_url) {
    let q = await music.add_queue(event, link.all[0])
    if (!q.error) {
      await interaction.followup.edit_original(context.params.event, {
        embeds: [
          {
            type: 'rich',
            title: `Queue added!`,
            description: `[${link.all[0].title}](${link.all[0].url}) [<@${context.params.event.author.id}>]`, 
            color: 0x00ff00,
          },
        ],
      })
    }else {
      await interaction.followup.edit_original(context.params.event, {
        content: `opse! something went wrong while adding the music to queue.`
      })
    }
  }else {
    let player = await music.play(event.guild_id, link.all[0].url, channel)
    if (player.channel_id) {
      await interaction.followup.edit_original(context.params.event, {
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
      })
    }else {
      await interaction.followup.edit_original(context.params.event, {
        content: `opse! something went wrong while playing the music.`
      })
    }
  }
}else if (command === 'pause') {
  let track = await lib.discord.voice['@0.0.1'].tracks.retrieve({
    guild_id: `${context.params.event.guild_id}`,
  });
  if (!track.media_url) return interaction.followup.edit_original(context.params.event, {
    content: `currently not playing any music.`
  })
  if (channel === track.channel_id) {
    if (track.paused) {
      return interaction.followup.edit_original(context.params.event, {
        content: `the track is already paused.`
      })
    }else {
      await lib.discord.voice['@0.0.1'].tracks.pause({
        guild_id: `${context.params.event.guild_id}`
      });
      return interaction.followup.edit_original(context.params.event, {
        content: `paused the track in <#${track.channel_id}>.`
      })
    }
  }else {
    await interaction.followup.edit_original(context.params.event, {
      content: `you're not in the same vc as me.`
    })
  }
}else if (command === 'resume') {
  let track = await lib.discord.voice['@0.0.1'].tracks.retrieve({
    guild_id: `${context.params.event.guild_id}`,
  });
  if (!track.media_url) return interaction.followup.edit_original(context.params.event, {
    content: `currently not playing any music.`
  })
  if (channel === track.channel_id) {
    if (track.paused) {
      await lib.discord.voice['@0.0.1'].tracks.resume({
        guild_id: `${context.params.event.guild_id}`
      });
      return interaction.followup.edit_original(context.params.event, {
        content: `resumed the track in <#${track.channel_id}>`
      })
    }else {
      return interaction.followup.edit_original(context.params.event, {
        content: `the music is still playing.`
      })
    }
  }else {
    return interaction.followup.edit_original(context.params.event, {
      content: `you're not in the same vc as me.`
    })
  }
}else if (command === 'skip') {
  let track = await lib.discord.voice['@0.0.1'].tracks.retrieve({
    guild_id: `${context.params.event.guild_id}`,
  });
  if (!track.media_url) return interaction.followup.edit_original(context.params.event, {
    content: `currently not playing any music.`
  })
  if (channel === track.channel_id) {
    let queue = await music.remove_queue(context.params.event)
    if (queue.length) {
      let m = await music.play(event.guild_id, queue[0].link, track.channel_id)
      if (m.error) return interaction.followup.edit_original(context.params.event, {
        content: `opse! something went wrong`
      })
      let video = await yts(queue[0].link)
      await interaction.followup.edit_original(context.params.event, {
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
      })
    }else {
      await lib.discord.voice['@0.0.1'].channels.disconnect({
        guild_id: `${context.params.event.guild_id}`
      });
      return interaction.followup.edit_original(context.params.event, {
        content: `disconnected from <#${track.channel_id}> as there is no more music to play.`
      })
    }
  }else {
    await interaction.followup.edit_original(context.params.event, {
      content: `you're not in the same vc as me.`
    })
  }
}else if (command === 'disconnect') {
  let track = await lib.discord.voice['@0.0.1'].tracks.retrieve({
    guild_id: `${context.params.event.guild_id}`,
  });
  if (!track.channel_id) return interaction.followup.edit_original(context.params.event, {
    content: `currently not in a vc.`
  })
  if (channel === track.channel_id) {
    await lib.discord.voice['@0.0.1'].channels.disconnect({
      guild_id: `${context.params.event.guild_id}`
    });
    return interaction.followup.edit_original(context.params.event, {
      content: `disconnected from <#${track.channel_id}>`
    })
  }else {
    await interaction.followup.edit_original(context.params.event, {
      content: `you're not in the same vc as me`
    })
  }
}else if (command === 'queue') {
  let now_playing = await lib.discord.voice['@0.0.1'].tracks.retrieve({
    guild_id: `${context.params.event.guild_id}`
  });
  let queue = await music.get_queue(context.params.event)
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
    return interaction.followup.edit_original(context.params.event, {
      embeds: embeds
    })
  }else {
    return interaction.followup.edit_original(context.params.event, {
      content: `Nothing is in the queue.`
    })
  }
}else {
  await interaction.followup.edit_original(context.params.event, {
    content: `unknown command`
  })
}