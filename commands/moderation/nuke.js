const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'nuke',
    ownerPermit: false,
    adminPermit: true,
    punitop: false,
    cat: 'moderation',
    run: async (client, message, args, prefix) => {
        // Ensure the command is executed in a text channel
        if (message.channel.type !== 0) { // 0 is GUILD_TEXT in Discord.js v14
            return message.reply('This command can only be executed in a text channel.');
        }

        // Create a confirmation message
        const confirmEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription(`Are you sure you want to delete this channel? Type \`confirm\` to confirm.`);

        // Send the confirmation message
        await message.channel.send({ embeds: [confirmEmbed] });

        // Create a collector to wait for a response
        const filter = response => response.author.id === message.author.id && response.content.toLowerCase() === 'confirm';
        const collector = message.channel.createMessageCollector({ filter, time: 30000 }); // 30 seconds timeout

        collector.on('collect', async (response) => {
            const channel = message.channel;
            const channelName = channel.name;
            const channelPosition = channel.position;
            const channelParent = channel.parentId; // Using parentId for v14

            // Get the channel's permission overwrites
            const permissionOverwrites = channel.permissionOverwrites.cache.map(overwrite => ({
                id: overwrite.id,
                allow: overwrite.allow,
                deny: overwrite.deny,
            }));

            // Delete the channel
            await channel.delete(`Channel deleted by the nuke command by ${response.author.tag}`);

            // Create a new channel with the same properties
            const newChannel = await channel.guild.channels.create({
                name: channelName,
                type: 0, // GUILD_TEXT
                parent: channelParent, // Set the same category
                position: channelPosition, // Set the same position
                permissionOverwrites: permissionOverwrites, // Set the same permissions
            });

            // Create an embed with the confirmation message
            const confirmationEmbed = new EmbedBuilder()
                .setColor('#a7fc7d')
                .setDescription(`> ${client.emoji.tick} This channel has been nuked by ${response.author}`)

            // Send the embed confirmation message
            const confirmationMessage = await newChannel.send({ embeds: [confirmationEmbed] });

            // Delete the confirmation message after 5 seconds
            setTimeout(() => {
                confirmationMessage.delete().catch(console.error);
            }, 5000); // 5000 milliseconds = 5 seconds

            collector.stop(); // Stop the collector after confirmation
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                message.channel.send('No confirmation was received in time. The nuke command has been canceled.');
            }
        });
    },
};
