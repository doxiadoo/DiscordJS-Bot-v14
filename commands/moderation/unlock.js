const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unlock',
    aliases: ['unlockchannel', 'unlockch'],
    punitop: false,
    adminPermit: true,
    ownerPermit: false,
    cat: 'moderation',
    run: async (client, message, args, prefix) => {
        // Get the mentioned channel or the current channel
        const channelId = args[0]; // The first argument as ID
        let ch = channelId ? message.guild.channels.cache.get(channelId) : message.channel || message.mentions.channels.first();

        // Validate the channel
        if (!ch || ch.type !== 0) { // Check if it's a text channel (GUILD_TEXT)
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} Please provide a valid channel or mention a channel.`)
                ]
            });
        }

        // Attempt to edit the channel permissions
        try {
            await ch.permissionOverwrites.edit(message.guild.id, { SendMessages: true });
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.tick} **${ch.name}** has been **unlocked** for <@&${message.guild.id}>.`)
                ]
            });
        } catch (e) {
            console.error(e);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} I lack the necessary permissions. Please check my permissions.`)
                ]
            });
        }
    }
};
