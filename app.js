const { Client, Collection, EmbedBuilder, WebhookClient, GatewayIntentBits, Partials } = require("discord.js");
const { mongoURL1, mongoURL2, mongoURL3, token, webhook_error } = require("./config.json");
const { Database } = require("quickmongo");
const ascii = require("ascii-table");
const CommandTable = new ascii().setHeading("Message Commands", "Status");
const EventsTable = new ascii().setHeading("Client Events", "Status");
const { readdirSync } = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const EventEmitter = require('events');

// Increase the limit of listeners for the EventEmitter to prevent memory leaks
EventEmitter.defaultMaxListeners = 15;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
    ],
    allowedMentions: {
        repliedUser: true,
        parse: ["everyone", "roles", "users"],
    },
    ws: {
        connectionTimeout: 30000, // Increase WebSocket handshake timeout
    },
});

// Client collections
client.commands = new Collection();
client.slashCommands = new Collection(); // Collection for slash commands
client.cools = new Collection();
client.data = new Database(mongoURL1); // logs, roles, ids, etc.
client.data2 = new Database(mongoURL2); // antinuke, server toggling
client.data3 = new Database(mongoURL3); // whitelist data

// Function to connect to databases
async function connectDatabases() {
    try {
        await Promise.all([client.data.connect(), client.data2.connect(), client.data3.connect()]);
        console.log('Bases de datos conectadas.');
    } catch (err) {
        console.error('Error al conectar las bases de datos:', err);
        process.exit(1); // Termina el proceso si hay un error en la conexi�n
    }
}

// Connect to databases
connectDatabases();
client.config = require(`./config.json`);
client.emoji = require(`./emojis.json`);

// Load message commands
readdirSync(`./src/commands/`).forEach((dir) => {
    const commandFiles = readdirSync(`./src/commands/${dir}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../src/commands/${dir}/${file}`);
        if (command && command.name && command.run) { // Verificar que el comando tiene 'name' y 'run'
            client.commands.set(command.name, command);
            CommandTable.addRow(command.name, "✅");
        } else {
            CommandTable.addRow(file, "❌");
        }
    }
});
console.log(CommandTable.toString());

// Load slash commands
const slashCommands = [];
const slashCommandFiles = readdirSync(`./src/slashCommands/`).filter(file => file.endsWith('.js'));
for (const file of slashCommandFiles) {
    const command = require(`../src/slashCommands/${file}`);
    if (command && command.data && typeof command.data.toJSON === 'function' && command.execute) { // Verificar que el comando tiene 'data' y 'execute'
        console.log(`Loading command: ${command.data.name}`); // For debugging
        slashCommands.push(command.data.toJSON()); // Ensure it's converted to JSON
        client.slashCommands.set(command.data.name, command);
    } else {
        console.error(`Slash command in file ${file} is not defined correctly.`);
    }
}

// Login the client and register global slash commands
client.login(token).then(() => {
    console.log('Bot connected as:', client.user.tag);

    // Register global slash commands
    const rest = new REST({ version: '9' }).setToken(token);
    (async () => {
        try {
            console.log('Starting to register global slash commands...');
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: slashCommands,
            });
            console.log('Global slash commands registered successfully.');
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    })();
}).catch(err => {
    console.error('Error logging in:', err);
});

// Load events
readdirSync("./src/events/").forEach(file => {  // Cambi� la ruta de '/src/events/' a './src/events/'
    require(`../src/events/${file}`)(client);
    const eventName = file.split(".")[0];
    EventsTable.addRow(eventName, "✅");
});
console.log(EventsTable.toString());

const webhookClient = new WebhookClient({ url: webhook_error });

// Error handling
process.on("unhandledRejection", (err) => {
    console.error(err);
    webhookClient.send({
        embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`\`\`\`js\n${err}\`\`\``)],
    });
});

process.on("uncaughtException", (err) => {
    console.error(err);
    webhookClient.send({
        embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`\`\`\`js\n${err}\`\`\``)],
    });
});

// Keep the bot alive
require("http").createServer((_, res) => res.end("Alive!")).listen(8080);

// Handle guildCreate event
client.on('guildCreate', async (guild) => {
    console.log(`Bot joined the guild: ${guild.id}`);

    // Wait a few seconds before making any API calls
    await new Promise(resolve => setTimeout(resolve, 5000));
});

// Handle interactions
client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
        const command = interaction.isCommand() ? client.slashCommands.get(interaction.commandName) : null;
        if (command && command.execute) { // Verificar que existe 'execute' antes de ejecutarlo
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error executing the command.', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'Command not found or is missing the execute method.', ephemeral: true });
        }
    } else if (interaction.isModalSubmit()) {
        // Handle modal submit interaction
        const command = client.slashCommands.get(interaction.customId);
        if (command && command.modalSubmit) {
            try {
                await command.modalSubmit(client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error processing your report.', ephemeral: true });
            }
        }
    }
});
