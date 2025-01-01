const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kick',
    aliases: [""],
    adminPermit: true,
    ownerPermit: false,
    punitop: false,
    cat: 'moderation',
    run: async (client, message, args, prefix) => {
        // Verificar si se proporcionó un argumento
        if (!args[0]) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} Command Usage: \`${prefix}kick <user> [reason]\``)
                ]
            });
        }

        // Obtener el usuario mencionado o de la caché
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} Please provide a valid user.`)
                ]
            });
        }

        // Comprobar restricciones
        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.cross} You can't **Kick** the server owner.`)
                ]
            });
        }
        if (client.config.owner.includes(user.id)) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.cross} I can't kick my owner.`)
                ]
            });
        }
        if (user.id === message.member.id) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.cross} You can't **Kick** yourself.`)
                ]
            });
        }
        if (!user.kickable) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} I can't **Kick** that user. Please check my role position and permissions.`)
                ]
            });
        }

        // Obtener razón del kick
        let reason = args.slice(1).join(' ') || 'No reason given';

        // Intentar ejecutar el kick
        try {
            await message.guild.members.kick(user.id, { reason: `${message.author.tag} | ${reason}` });
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.tick} Successfully **Kicked** ${user.user.tag} executed by: ${message.author.tag}\n${client.emoji.arrow} Reason: ${reason}`)
                ]
            });
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} I can't kick that user. Check my role position and permissions.`)
                ]
            });
        }
    }
};