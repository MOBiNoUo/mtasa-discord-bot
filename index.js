const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
dotenv.config();
const mtasa = require('./src/mtasa-query');
let mtasa_json;
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, ] });

(async () => {
  try {
    console.log('Getting Information from Mtasa Server...');
    const query =  await mtasa.getBy(process.env.SERVER_IP, process.env.SERVER_ASEPORT);
    if (query.status == false) {
      console.clear();
      console.log('\x1b[31m%s\x1b[0m', '[API-ERROR]: ' + query.error);
      process.exit();
    }
    mtasa_json = query;
    console.clear();
    client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error(err);
    process.exit();
  }
})();

const commands = [
    {
        name: 'info',
        description: 'Show Info of Server!',
    },
];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
const clientId = process.env.DISCORD_CLIENTID;

client.once('ready', () => {
    console.log(`The ${client.user.tag} Runned Successfully! `);
    
    client.guilds.cache.forEach(async (guild) => {
        const guildId = guild.id;

        try {
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
            console.log(`Commands created (or Reloaded) for Guild: ${guild.name}`);
            if (mtasa_json) {
                client.user.setPresence({
                    activities: [{ name: `${mtasa_json.data.num_players} Player on Server !`, type: ActivityType.Watching }],
                    status: 'online',
                });
            }
        } catch (error) {
            console.error(`Failed to create commands for Guild: ${guild.name}`);
            console.error(error);
        }
    });
});

client.on('guildCreate', async (guild) => {
    const guildId = guild.id;

    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log(`Commands created for Guild: ${guild.name}`);
    } catch (error) {
        console.error(`Failed to create commands for Guild: ${guild.name}`);
        console.error(error);
    }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  if (commandName == 'info') {
    const query =  await mtasa.getBy(process.env.SERVER_IP, process.env.SERVER_PORT);
    if (query.status == false) {
      console.clear();
      console.log('\x1b[31m%s\x1b[0m', '[API-ERROR]: ' + query.error);
      process.exit();
    }
  const infoEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(query.data.servername)
            .setDescription(`:person_pouting: Players Count: ${query.data.num_players} \n:slot_machine: Max Players: ${query.data.max_players}\n:game_die: GameMode: ${query.data.gametype}\n:anchor: Address: ${query.data.gq_address}:${query.data.port}\n:key: Password: ${query.data.password === '0' ? 'No' : 'Yes'}`)
            .setTimestamp()
            const buttons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                  .setLabel('Connect')
                  .setURL('https://ouomen.ir')
                  .setStyle(ButtonStyle.Link),
            );
            await interaction.reply({
              content: '',
              embeds: [infoEmbed],
              components: [buttons],
              ephemeral: false });
        
  }
});

async function updatePresence() {
  if (mtasa_json) {
      const res = await mtasa.getBy(process.env.SERVER_IP, process.env.SERVER_PORT);
      if (res.status == false) {
        console.clear();
        console.log('\x1b[31m%s\x1b[0m', '[API-ERROR]: ' + res.error);
        process.exit();
      }
      const currentPlayers = res.data.num_players;
      const currentActivity = `${currentPlayers} Player on Server !`;

      if (client.user.presence.activities[0].name !== currentActivity) {
          client.user.setPresence({
              activities: [{ name: currentActivity, type: ActivityType.Watching }],
              status: 'online',
          });
      }
  }
}

setInterval(updatePresence, 5000);