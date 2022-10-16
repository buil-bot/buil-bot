const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (event,perm,user_id) => {
  let canUse = false;
  let guildInfo = await lib.discord.guilds['@0.1.0'].retrieve({
    guild_id: `${event.guild_id}`
  });
  let roles = await lib.discord.guilds['@0.1.0'].roles.list({
    guild_id: `${event.guild_id}`
  });
  let userRoles = roles.filter((role) => event.member.roles.includes(role.id));
  for (let i = 0; i < userRoles.length; i++) {
    let _role = userRoles[i];
    if ((_role.permissions & perm) === perm) {
      canUse = true;
      break;
    }
  }
  if (guildInfo.owner_id === event.author.id) {
    canUse = true;
  }
  return canUse
}