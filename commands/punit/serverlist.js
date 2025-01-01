const { EmbedBuilder } = require("discord.js");
const fs = require('fs');
const path = require('path');

// Replace with an array of bot owner's IDs
const OWNER_IDS = ['763141886834769980', '123456789012345678'];

module.exports = {
    name: 'serverlist',
    aliases: ['sl'],
    priority: true,
    adminOnly: false,
    ownerOnly: true,
    category: 'admin',
    run: async (client, message, args, prefix) => {
        // Check if the user is an owner
        if (!OWNER_IDS.includes(message.author.id)) {
            return message.reply("<:deny:1312884018160599181> You do not have permission to use this command.");
        }

        // Fetch the list of guilds
        const guilds = client.guilds.cache.map(guild => `- **${guild.name}** (\`${guild.id}\`)`);

        // If the bot is not in any servers
        if (guilds.length === 0) {
            return message.reply("<:warning:1312884332859494400> The bot is not currently in any servers.");
        }

        // Prepare embed
        const embed = new EmbedBuilder()
            .setTitle("📋 Server List")
            .setDescription(guilds.join("\n"))
            .setColor("Blue")
            .setFooter({ text: `Total: ${guilds.length} servers` });

        // Send the embed
        return message.channel.send({ embeds: [embed] });
    },
};
