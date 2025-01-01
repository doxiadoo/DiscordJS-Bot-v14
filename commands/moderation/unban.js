const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'unban',
    aliases: ['ub'],
    punitop: false,
    adminPermit: true,
    cat: 'moderation',
    ownerPermit: false,
    run: async (client, message, args, prefix) => {
        // Check if the user has permission to unban
        if (!message.member.permissions.has('BanMembers')) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} You do not have permission to unban members.`)
                ]
            });
        }

        if (!args[0]) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} Command Usage: \`${prefix}unban <user_id>\``)
                ]
            });
        }

        const bans = await message.guild.bans.fetch().catch(() => {});
        let reason = args.slice(1).join(' ') || 'No reason given';

        // Find the user in the ban list by their ID
        let user = bans.get(args[0]);

        if (!user) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.cross} I couldn't find that member in the ban list.`)
                ]
            });
        }

        try {
            await message.guild.members.unban(user.id, `${message.author.tag} | ${reason}`);
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.tick} Successfully **Unbanned** ${user.tag} executed by: ${message.author.tag}\n${client.emoji.arrow} Reason: ${reason}`)
                ]
            });
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} An error occurred while trying to unban the user. Please check my permissions.`)
                ]
            });
        }
    }
};
