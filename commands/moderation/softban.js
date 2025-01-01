const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'softban',
    aliases: [],
    ownerPermit: false,
    adminPermit: true,
    punitop: false,
    cat: 'moderation',
    run: async (client, message, args, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(`${client.emoji.cross} | You don't have permission to use this command.`);

            return message.reply({ embeds: [embed], ephemeral: true });
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(`${client.emoji.cross} | I don't have permission to ban members.`);

            return message.reply({ embeds: [embed], ephemeral: true });
        }

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            const embed = new EmbedBuilder()
                .setColor("#FFA500")
                .setDescription(`> ${client.emoji.warning} ${message.author.toString()}: Mention a user`);

            return message.reply({ embeds: [embed] });
        }

        if (user.id === message.author.id) {
            const embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(`${client.emoji.cross} | You cannot softban yourself.`);

            return message.reply({ embeds: [embed] });
        }

        if (user.id === client.user.id) {
            const embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(`${client.emoji.cross} | You cannot softban me.`);

            return message.reply({ embeds: [embed] });
        }

        if (user.roles.highest.position >= message.member.roles.highest.position && message.guild.ownerId !== message.author.id) {
            const embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(`${client.emoji.cross} | You cannot softban a member with a role equal to or higher than yours.`);

            return message.reply({ embeds: [embed] });
        }

        const reason = args.slice(1).join(" ") || "No reason provided.";

        try {
            await user.send(`You have been banned from **${message.guild.name}** for: ${reason}`)
                .catch(() => console.log("Could not send a message to the user."));

            await message.guild.members.ban(user, { days: 7, reason });
            await message.guild.members.unban(user, "Softban executed");

            await message.react(`${client.emoji.tick}`);
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(`${client.emoji.tick} | There was an error trying to perform the softban.`);

            return message.reply({ embeds: [embed] });
        }
    }
};
