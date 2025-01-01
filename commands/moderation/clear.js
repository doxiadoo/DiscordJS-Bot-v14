const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'clear',
    aliases: ['purge'],
    ownerPermit: false,
    adminPermit: true,
    punitop: false,
    cat: 'moderation',
    run: async (client, message, args, prefix) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply({ content: 'You do not have permission to manage messages.', ephemeral: true });
        }

        if (!args[0]) {
            const helpEmbed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('Purge Command')
                .setDescription('This command can delete a specified number of messages in this channel.\n```Syntax: ,clear <number of messages>\nExample: ,clear 99\nExample: ,clear 99 @user```');
            
            return message.channel.send({ embeds: [helpEmbed] });
        }

        const cantidad = parseInt(args[0]);
        const usuario = message.mentions.users.first();

        if (isNaN(cantidad) || cantidad < 1 || cantidad > 5000) {
            return message.reply({ content: '<:warning:1320071921001566269> Please enter a valid number between 1 and 5000.' });
        }

        let totalDeleted = 0;

        while (totalDeleted < cantidad) {
            const remaining = cantidad - totalDeleted;
            const fetchLimit = remaining > 100 ? 100 : remaining;

            const messages = await message.channel.messages.fetch({ limit: fetchLimit });
            const filteredMessages = usuario
                ? messages.filter(msg => msg.author.id === usuario.id && (Date.now() - msg.createdTimestamp) < 1209600000)
                : messages.filter(msg => (Date.now() - msg.createdTimestamp) < 1209600000);

            if (filteredMessages.size === 0) {
                message.reply({ content: '<:deny:1320071905453277275> No valid messages were found to delete.' });
                break;
            }

            try {
                const { size } = await message.channel.bulkDelete(filteredMessages, true);
                totalDeleted += size;
            } catch (error) {
                console.error(error);
                if (error.code === 10008) {
                    message.reply({ content: '<:warning:1320071921001566269> Some messages could not be deleted as they no longer exist.' });
                    break;
                }
            }
        }

        const confirmEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`> <:approve:1320071874885062726> Cleared **${totalDeleted}** messages from **${usuario ? usuario.username : "all users"}** in **${message.channel.name}**.`);
        
        const confirmationMessage = await message.channel.send({ embeds: [confirmEmbed] });

        setTimeout(() => {
            confirmationMessage.delete().catch(console.error);
        }, 5000);
    }
};
