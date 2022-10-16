const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const interaction = require('autocode-discord-interaction')
const getData = require('../../../helpers/ecoData.js')

await interaction.callback.command_defer(context.params.event)
let command = context.params.event.data.options[0].name

if (command === 'start') {
  let data = await getData(context.params.event, null, true)
  if (data.new_user) {
    await interaction.followup.edit_original(context.params.event, {
      content: `welcome! <@!${context.params.event.author.id}>, here's your first ${data.rows[0].fields.balance} coins`
    })
  }else {
    await interaction.followup.edit_original(context.params.event, {
      content: `you have already started.`
    })
  }
}else if (command === 'balance') {
  let user_id = context.params.event.data.options[0]?.options?.find(o => o.name === 'user')?.value ?? context.params.event.member.user.id
  let user = await lib.discord.users['@0.2.0'].retrieve({
    user_id: `${user_id}`
  });
  let data = await getData(context.params.event, user.id, true)
  if (user.bot) return interaction.followup.edit_original(context.params.event, {
    content: `bots can't have accounts.`
  })
  await interaction.followup.edit_original(context.params.event, {
    embeds: [
      {
        title: `${user.username}#${user.discriminator}`,
        color: 0x00ff00,
        fields: [
          {
            name: `Current balance`,
            value: `${data.rows[0]?.fields?.balance}`,
            inline: true
          },
          {
            name: `Bank balance`,
            value: `${data.rows[0]?.fields?.bank_balance}`,
            inline: true
          }
        ],
      }
    ],
  })
}else if (command === 'give') {
  let user_id = context.params.event.data.options[0]?.options?.find(o => o.name === 'user')?.value 
  let amount = parseInt(context.params.event.data.options[0]?.options?.find(o => o.name === 'amount')?.value)
  try {
    let u = await lib.discord.guilds['@0.2.1'].members.retrieve({
      user_id: `${user_id}`,
      guild_id: `${context.params.event.guild_id}`
    });
    if (u.user.bot) {
      return interaction.followup.edit_original(context.params.event, {
        content: `You cannot give coins to a bot.`
      })
    }else if(u.user.id === context.params.event.member.user.id) {
      return interaction.followup.edit_original(context.params.event, {
        content: `You cannot give coins to yourself.`
      })
    }
  }catch(e) {
    return interaction.followup.edit_original(context.params.event, {
      content: 'unknown user.'
    })
  }
  let data = await getData(context.params.event, null , true)
  let data2 = await getData(context.params.event, user_id, true)
  if (amount <= data.rows[0].fields.balance) {
    //user has enough coins
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${context.params.event.member.user.id}`
        }
      ],
      fields: {
        'balance': `${parseInt(data.rows[0].fields.balance) - amount}`,
      }
    });
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:F`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${user_id}`
        }
      ],
      fields: {
        'balance': `${parseInt(data2.rows[0].fields.balance) + amount}` 
      }
    });
    await interaction.followup.edit_original(context.params.event, {
      content: `you gave <@!${user_id}> ${amount} coins.`
    })
  }else {
    return interaction.followup.edit_original(context.params.event, {
      content: `you don't have enough coins.`
    })
  }
}else if (command === 'deposite') {
  let amount = parseInt(context.params.event.data.options[0]?.options?.find(o => o.name === 'amount')?.value)
  let data = await getData(context.params.event, null, true)
  if (amount <= data.rows[0].fields.balance) {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${context.params.event.member.user.id}`
        }
      ],
      fields: {
        'balance': `${parseInt(data.rows[0].fields.balance) - amount}`,
        'bank_balance': `${parseInt(data.rows[0].fields.bank_balance) + amount}`
      }
    });
    await interaction.followup.edit_original(context.params.event, {
      content: `successfully deposited ${amount} into your bank.`
    })
  }else {
    await interaction.followup.edit_original(context.params.event, {
      content: `you don't have enough coins.`
    })
  }
}else if (command === 'withdraw') {
  let amount = parseInt(context.params.event.data.options[0]?.options?.find(o => o.name === 'amount')?.value)
  let data = await getData(context.params.event, null, true)
  if (amount <= data.rows[0].fields.balance) {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${context.params.event.member.user.id}`
        }
      ],
      fields: {
        'balance': `${parseInt(data.rows[0].fields.balance) + amount}`,
        'bank_balance': `${parseInt(data.rows[0].fields.bank_balance) - amount}`
      }
    });
    await interaction.followup.edit_original(context.params.event, {
      content: `successfully withdrew ${amount} from your bank.`
    })
  }else {
    await interaction.followup.edit_original(context.params.event, {
      content: `you don't have enough coins.`
    })
  }
}else if (command === 'find') {
  let data = await getData(context.params.event, null, true)
  await interaction.followup.edit_original(context.params.event, {
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
  })
}else if (command === 'rob') {
  let user_id = context.params.event.data.options[0]?.options?.find(o => o.name === 'user')?.value 
  try {
    let u = await lib.discord.guilds['@0.2.1'].members.retrieve({
      user_id: `${user_id}`,
      guild_id: `${context.params.event.guild_id}`
    });
    if (u.user.bot) {
      return interaction.followup.edit_original(context.params.event, {
        content: `You cannot give coins to a bot.`
      })
    }else if(u.user.id === context.params.event.member.user.id) {
      return interaction.followup.edit_original(context.params.event, {
        content: `You cannot give coins to yourself.`
      })
    }
  }catch(e) {
    return interaction.followup.edit_original(context.params.event, {
      content: 'unknown user.'
    })
  }
  let data = await getData(context.params.event, null , true)
  let data2 = await getData(context.params.event, user_id, true)
  if (parseInt(data.rows[0].fields.balance) < 500) {
    return interaction.followup.edit_original(context.params.event, {
      content: `you need to have atleast 500 coins to rob.`
    })
  }else if (parseInt(data2.rows[0].fields.balance) > 500) {
    return interaction.followup.edit_original(context.params.event, {
      content: `the other user doesn't even have 500 coins, leave them alone.`
    })
  }
  let won_amount = Math.floor(Math.random() * 400)
  let lost_amount = Math.floor(Math.random() * 400)
  let replies = [
    `You got ${won_amount} coins by robbing <@!${user_id}>.`,
    `<@!${context.params.event.mentions[0].id}> caught you, you lost ${lost_amount} coins.`
  ]
  let reply = replies[Math.floor(Math.random()* replies.length)]
  if (reply.includes(`${won_amount}`)) {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${user_id}`
        }
      ],
      fields: {
        'balance': `${parseInt(data2.rows[0].fields.balance) - won_amount}`
      }
    });
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${context.params.event.member.user.id}`
        }
      ],
      fields: {
        'balance': `${parseInt(data.rows[0].fields.balance) + won_amount}`
      }
    });
  }else if (reply.includes(`${lost_amount}`)) {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${user_id}`
        }
      ],
      fields: {
        'balance': `${parseInt(data2.rows[0].fields.balance) + lost_amount}`
      }
    });
    await lib.googlesheets.query['@0.3.0'].update({
      range: `eco!A:E`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'user_id__is': `${context.params.event.member.user.id}`
        }
      ],
      fields: {
        'balance': `${parseInt(data.rows[0].fields.balance) - lost_amount}`
      }
    });
  }
  await interaction.followup.edit_original(context.params.event, {
    content: `${reply}`
  })
}else if (command === 'leaderboard') {
  let eco_data = await lib.googlesheets.query['@0.3.0'].select({
    range: `eco!A:E`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'guild_ids__contains': `${context.params.event.guild_id}`
      }
    ],
  });
  let embeds = []
  if (eco_data.rows[0]) {
    eco_data.rows.sort((a,b) => {
      return parseInt(b.fields.balance) - parseInt(a.fields.balance)
    });
    let fields = []
    for (let i = 0; i < eco_data.rows.slice(0,10).length; i++) {
      let userName = `${i+1}. ${await getUsername(eco_data.rows[i].fields.user_id)}`
      let userValue = `${eco_data.rows[i].fields.balance} coins`;
      fields.push({ name: userName, value: userValue })
    }
    embeds.push({
      title: `Eco leaderboard`,
      color: 0x00ff00,
      fields: fields
    })
  }
  if (embeds.length) {
    await interaction.followup.edit_original(context.params.event, {
      embeds: embeds
    })
  }else {
    await interaction.followup.edit_original(context.params.event, {
      content: `there are not enought user to display a leaderboard.`
    })
  }
}else {
  await interaction.followup.edit_original(context.params.event, {
    content: 'unknown command'
  })
}
async function getUsername (id) {
  let user = await lib.discord.users['@0.2.0'].retrieve({
    user_id: `${id}`
  });
  return user.username
}