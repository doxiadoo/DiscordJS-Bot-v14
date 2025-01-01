const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'hide',
    aliases: ["show"],
    punitop: false,
    adminPermit: true,
    ownerPermit: false,
    cat: 'moderation',
    run: async (client, message, args, prefix) => {
        // Obtén el ID del canal mencionado o el canal actual
        const channelId = args[0]; // El primer argumento como ID
        let ch = channelId ? message.guild.channels.cache.get(channelId) : message.channel || message.mentions.channels.first();
        
        // Valida si se encontró el canal
        if (!ch) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} Please provide a valid channel.`)
                ]
            });
        }

        try {
            // Editar los permisos del canal
            await ch.permissionOverwrites.edit(message.guild.id, {
                [PermissionFlagsBits.ViewChannel]: false // Cambiar a la forma correcta
            });

            // Enviar mensaje de éxito
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.tick} Successfully **Hided** ${ch} for <@&${message.guild.id}>.`)
                ]
            });

        } catch (e) {
            console.error(e);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} I am missing adequate permissions. Please check my permissions.`)
                ]
            });
        }
    }
};
