const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'purgebot',
    ownerPermit: false,
    adminPermit: true,
    punitop: false,
    cat: 'moderation',
    run: async (client, message, args, prefix) => {
        // Check for administrator permissions
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply({ content: 'You do not have permission to manage messages.', ephemeral: true });
        }

        let totalDeleted = 0;

        // Fetch messages and filter for bot messages
        const fetchLimit = 100; // Maximum number of messages to fetch at once
        let fetchedMessages;

        do {
            fetchedMessages = await message.channel.messages.fetch({ limit: fetchLimit });
            const botMessages = fetchedMessages.filter(msg => msg.author.bot);

            if (botMessages.size === 0) break; // Exit loop if no more bot messages

            try {
                const { size } = await message.channel.bulkDelete(botMessages, true);
                totalDeleted += size;
            } catch (error) {
                console.error(error);
                // Handle any errors gracefully
            }
        } while (fetchedMessages.size >= fetchLimit);

        // Send confirmation message if any messages were deleted
        if (totalDeleted > 0) {
            const confirmEmbed = new EmbedBuilder()
                .setColor(0xff0000)  // Hexadecimal code for red
                .setDescription(`Cleared **${totalDeleted}** bot messages from the channel.`);

            const confirmationMessage = await message.channel.send({ embeds: [confirmEmbed] });

            // Delete the confirmation message after 5 seconds
            setTimeout(() => {
                confirmationMessage.delete().catch(console.error);
            }, 5000);
        } else {
            message.reply({ content: 'No bot messages found to delete.', ephemeral: true });
        }
    }
};
