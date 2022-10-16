const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const ytdl = require('ytdl-core');
const guildData = require('./guildData.js')

module.exports = {
  play: async (guild, link, channel) => {
    try {
      let downloadInfo = await ytdl.getInfo(link);
      let data = await lib.discord.voice['@0.0.1'].tracks.play({
        channel_id: `${channel}`,
        guild_id: `${guild}`,
        download_info: downloadInfo
      }); 
      return data
    } catch (e) {
      return {error: e}
    }
  },
  add_queue: async (event, data) => {
    let d = await guildData(event)
    let queue = JSON.parse(d.rows[0].fields.music_queue)
    try {
      queue.push({
        link: data.url,
        title: data.title,
        user: event?.author?.id ?? event?.member?.user?.id
      })
      await lib.googlesheets.query['@0.3.0'].update({
        range: `guild!A:H`,
        bounds: 'FIRST_EMPTY_ROW',
        where: [
          {
            'guild_id__is': `${event.guild_id}`
          }
        ],
        limit: {
          'count': 0,
          'offset': 0
        },
        fields: {
          'music_queue': JSON.stringify(queue)
        }
      });
      return queue
    }catch(e) {
      return {error: e}
    }
  },
  remove_queue: async (event, name) => {
    let d = await guildData(event)
    let queue = JSON.parse(d.rows[0].fields.music_queue)
    if (name) {
      try {
        await lib.googlesheets.query['@0.3.0'].update({
          range: `guild!A:H`,
          bounds: 'FIRST_EMPTY_ROW',
          where: [
            {
              'guild_id__is': `${event.guild_id}`
            }
          ],
          limit: {
            'count': 0,
            'offset': 0
          },
          fields: {
            'music_queue': JSON.stringify(queue.filter(q => q.title.toLowerCase().includes(`${name.toLowerCase()}`)))
          }
        });
        return queue.filter(q => q.title.toLowerCase().includes(`${name.toLowerCase()}`))
      }catch(e) {
        return {error:e}
      }
    }else {
      try {
        await lib.googlesheets.query['@0.3.0'].update({
          range: `guild!A:H`,
          bounds: 'FIRST_EMPTY_ROW',
          where: [
            {
              'guild_id__is': `${event.guild_id}`
            }
          ],
          limit: {
            'count': 0,
            'offset': 0
          },
          fields: {
            'music_queue': JSON.stringify(queue.slice(1))
          }
        });
        return queue
      }catch(e) {
        return {error:e}
      }
    }
  },
  clear_queue: async (event) => {
    let d = await guildData(event)
    try {
      await lib.googlesheets.query['@0.3.0'].update({
        range: `guild!A:H`,
        bounds: 'FIRST_EMPTY_ROW',
        where: [
          {
            'guild_id__is': `${event.guild_id}`
          }
        ],
        limit: {
          'count': 0,
          'offset': 0
        },
        fields: {
          'music_queue': `[]`
        }
      });
      return []
    }catch(e) {
      return {error:e}
    }
  },
  get_queue: async (event) => {
    let d = await guildData(event)
    let queue = JSON.parse(d.rows[0].fields.music_queue)
    return queue
  }
}