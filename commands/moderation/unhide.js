const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'unhide',
    aliases: ['unshow'],
    punitop: false,
    ownerPermit: false,
    adminPermit: true,
    cat: 'moderation',
    run: async (client, message, args, prefix) => {
        // Get the channel to unhide
        const ch = message.guild.channels.cache.get(args[0]) || message.channel || message.mentions.channels.first();

        // If no channel is specified, send an error message
        if (!ch) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} Please provide a valid channel to unhide.`)
                ]
            });
        }

        try {
            // Update channel permission to allow everyone to view the channel
            await ch.permissionOverwrites.edit(message.guild.id, { VIEW_CHANNEL: true });

            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.tick} Successfully **Unhided** ${ch} for everyone.`)
                ]
            });
        } catch (e) {
            console.error(e); // Log the error for debugging
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} I am missing adequate permissions or an error occurred. Please check my permissions.`)
                ]
            });
        }
    }
};
