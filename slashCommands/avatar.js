const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays a user\'s avatar.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user whose avatar you want to see.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        // Verificar si el comando se ejecuta en un servidor o en un mensaje directo
        let avatarURL;
        let title;

        if (interaction.guild) {
            // Comando ejecutado en un servidor
            const member = await interaction.guild.members.fetch(user.id); // Obtener al miembro del servidor
            avatarURL = member.displayAvatarURL({ dynamic: true, size: 512 }); // Avatar del servidor
            title = `Avatar of ${user.username} (Server)`;
        } else {
            // Comando ejecutado en un mensaje directo
            avatarURL = user.avatarURL({ dynamic: true, size: 512 }); // Avatar global
            title = `Avatar of ${user.username} (Global)`;
        }

        // Crear un embed con el avatar
        const avatarEmbed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle(title)
            .setImage(avatarURL)
            .setFooter({ text: 'Click the button below to see the global avatar!' });

        // Crear un botón para mostrar el avatar global
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('display_avatar')
                    .setLabel('Global')
                    .setStyle(ButtonStyle.Secondary) // Color gris
            );

        // Enviar el mensaje con el embed y el botón
        const sentMessage = await interaction.reply({
            embeds: [avatarEmbed],
            components: [row],
            fetchReply: true
        });

        // Filtrar las interacciones para el collector
        const filter = (btnInteraction) => btnInteraction.user.id === interaction.user.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (btnInteraction) => {
            if (btnInteraction.customId === 'display_avatar') {
                // Crear un nuevo embed mostrando el avatar global
                const globalAvatarEmbed = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setTitle(`Global Avatar of ${user.username}`)
                    .setImage(user.avatarURL({ dynamic: true, size: 512 }))  // Avatar global
                    .setFooter({ text: 'This is the global avatar!' });

                // Responder con el nuevo embed mostrando el avatar global de manera efímera
                await btnInteraction.reply({
                    embeds: [globalAvatarEmbed],
                    ephemeral: true  // Hacer el embed efímero
                });
            }
        });

        collector.on('end', () => {
            row.components[0].setDisabled(true); // Desactivar el botón después de que termine el collector
            sentMessage.edit({ components: [row] }); // Editar el mensaje para reflejar el cambio
        });
    }
};
