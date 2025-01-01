const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'threadlocked',
    aliases: ['lockthread', 'tl'],
    ownerPermit: false,
    adminPermit: true,
    punitop: false,
    cat: 'moderation',
    run: async (client, message, args, prefix) => {
        // Check if the message is in a thread
        if (!message.channel.isThread()) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2f3136")
                        .setDescription(`${client.emoji.warning} **|** This command can only be used inside a thread.`)
                ]
            });
        }

        // Check bot permissions
        if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageThreads)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2f3136")
                        .setDescription(`${client.emoji.warning} **|** I don't have the \`MANAGE_THREADS\` permission.`)
                ]
            });
        }

        try {
            // Lock the thread
            await message.channel.setLocked(true);

            // Respond to the user with the executor and channel information
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2f3136")
                        .setDescription(
                            `${client.emoji.tick} **|** ${message.author} successfully locked ${message.channel}.`
                        )
                ]
            });
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2f3136")
                        .setDescription(`${client.emoji.warning} **|** There was an error while trying to lock the thread.`)
                ]
            });
        }
    }
};