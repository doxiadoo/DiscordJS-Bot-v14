const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'info',
    run: async (client, message, args, prefix) => {
        // Obtener el usuario mencionado o el autor del mensaje si no hay ninguno
        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member;

        if (!user) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`${client.emoji.cross} | I couldn't find the provided member.`)
                ]
            });
        }

        // Crear el embed con el avatar del usuario
        const avatarEmbed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle(`Avatar of ${user.user.username}`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter({ text: 'Click the button below to see the avatar link!' });

        // Crear el botón para mostrar el avatar
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('display_avatar')
                    .setLabel('Display Avatar Link')
                    .setStyle(ButtonStyle.Secondary) // Color gris
            );

        // Enviar el mensaje con el embed y el botón
        const sentMessage = await message.channel.send({ embeds: [avatarEmbed], components: [row] });

        // Filtrar interacciones para el collector
        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'display_avatar') {
                await interaction.reply({
                    content: `Here is the avatar link: ${user.displayAvatarURL({ dynamic: true, size: 512 })}`,
                    ephemeral: true // Solo el autor del comando verá este mensaje
                });
            }
        });

        collector.on('end', () => {
            row.components[0].setDisabled(true); // Deshabilitar el botón al finalizar el collector
            sentMessage.edit({ components: [row] }); // Editar el mensaje para reflejar el cambio
        });
    }
};