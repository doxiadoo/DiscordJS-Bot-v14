const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'ban',
    aliases: ['b'],
    ownerPermit: false,
    adminPermit: true,
    punitop: false,
    cat: 'moderation',
    run: async (client, message, args, prefix) => {
        // Verificar si el usuario tiene permisos para banear
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(`> ${client.emoji.warning} You don't have the necessary permissions to ban users.`)
                ]
            });
        }

        // Verificar si hay argumentos
        if (!args[0]) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setTitle('ban command')
                    .setDescription('This command can ban users.\n```Syntax: ,ban <id or username>\nUsage: ,ban @user```')
                ]
            });
        }

        // Obtener usuario de las menciones o por ID
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} Please provide a valid user mention or ID.`)
                ]
            });
        }

        // Obtener razón o asignar una razón por defecto
        let reason = args.slice(1).join(' ') || 'No reason given';

        // Prevenir el baneo de ciertos usuarios
        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(`> ${client.emoji.cross} You can't **Ban** the Server Owner.`)
                ]
            });
        }

        if (client.config.owner.includes(user.id)) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(`> ${client.emoji.cross} I can't **Ban** my owner.`)
                ]
            });
        }

        if (user.id === message.member.id) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(`> ${client.emoji.cross} You cannot **Ban** yourself.`)
                ]
            });
        }

        // Verificar si el bot puede banear al usuario
        if (!user.bannable) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(`> ${client.emoji.warning} I can't **Ban** that user. Please check my role position and permissions.`)
                ]
            });
        }

        // Intentar banear al usuario
        try {
            await message.guild.members.ban(user.id, { reason: `${message.author.tag} | ${reason}` });

            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#00ff00')
                    .setDescription(`> ${client.emoji.tick} Successfully **Banned** ${user.user.tag}, executed by: ${message.author.tag}\n${client.emoji.arrow} Reason: ${reason}`)
                ]
            });

        } catch (err) {
            console.error(err);
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(`> ${client.emoji.warning} I couldn't **Ban** that user. Please check my role position and permissions.`)
                ]
            });
        }
    }
};