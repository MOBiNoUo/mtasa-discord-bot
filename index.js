const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const token = 'MTIxNTIwODc3OTk0ODQ5MDc4Mg.GPd4AR.wwk6rhsLuwLC9mmAijN4D1mIKvL-VHB73L8Pf0';
const clientId = '1215208779948490782';
const commands = [
  {
      name: 'players',
      description: 'Show Info of Online Players!',
  },
];

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, ] });

const rest = new REST({ version: '9' }).setToken(token);

client.on('guildCreate', async (guild) => {
  const guildId = guild.id;

  try {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log(`Commands created for Guild: ${guild.name}`);
      // const guildCount = client.guilds.cache.size;
      // client.user.setPresence({
      //   activities: [{ name: `in ${guildCount} Server!`, type: ActivityType.Playing }],
      //   status: 'online',
      // });
  } catch (error) {
      console.error(`Failed to create commands for Guild: ${guild.name}`);
      console.error(error);
  }
});

// client.on('guildDelete', async (guild) => {
//   const guildCount = client.guilds.cache.size;
//   client.user.setPresence({
//     activities: [{ name: `in ${guildCount} Server!`, type: ActivityType.Playing }],
//     status: 'online',
//   });
// });

client.once('ready', () => {
  console.log(`The ${client.user.tag} Runned Successfully! `);
  client.guilds.cache.forEach(async (guild) => {
    const guildId = guild.id;

    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log(`Commands created (or Reloaded) for Guild: ${guild.name}`);
    } catch (error) {
        console.error(`Failed to create commands for Guild: ${guild.name}`);
        console.error(error);
    }
  });
});


client.login(token);
