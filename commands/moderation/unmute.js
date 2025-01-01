const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unmute',
    aliases: ['um'],
    punitop: false,
    adminPermit: true,
    ownerPermit: false,
    cat: 'moderation',
    run: async (client, message, args, prefix) => {
        // Check if a user was mentioned or provided
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`> ${client.emoji.warning} Command Usage: \`${prefix}unmute <user> [reason]\``)
                ]
            });
        }

        // Get the user to unmute
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`> ${client.emoji.warning} Please provide me a valid user.`)
                ]
            });
        }

        let reason = args.slice(1).join(' ') || 'No Reason given';

        // Prevent the bot from being unmuted or the server owner
        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`> ${client.emoji.cross} Why would you want to unmute me?`)
                ]
            });
        }

        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`> ${client.emoji.cross} You can't unmute the Server Owner!`)
                ]
            });
        }

        // Check if the user is currently muted
        if (!user.isCommunicationDisabled()) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`> ${client.emoji.cross} I can't unmute that user. They are not muted.`)
                ]
            });
        }

        // Check if the bot can manage the user
        if (!user.manageable) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`> ${client.emoji.warning} I can't unmute that user. Please check my role position and permissions.`)
                ]
            });
        }

        // Unmute the user
        await user.timeout(0, `${message.author.tag} | ${reason}`);

        // Send confirmation message
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.tick} Successfully **Unmuted** ${user.user.tag} executed by: ${message.author.tag}\n${client.emoji.arrow} Reason: ${reason}`)
            ]
        });
    }
};
