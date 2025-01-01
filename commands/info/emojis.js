const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'emojis',
    aliases: [''],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'info',
    run: async (client, message, args, prefix) => {
        // Obtener la lista de emojis del servidor
        const emojis = message.guild.emojis.cache;

        if (emojis.size === 0) {
            return message.reply('There are no emojis in this server.');
        }

        // Convertir la Collection en un array para poder usar slice
        const emojisArray = Array.from(emojis.values());

        // Paginación: determinar el número de páginas
        const emojisPerPage = 10;
        const totalPages = Math.ceil(emojisArray.length / emojisPerPage);

        let currentPage = 0;

        // Función para crear el embed con la lista de emojis de una página
        const createEmbed = (page) => {
            let description = '';

            // Selecciona los emojis de la página actual
            const emojisPage = emojisArray.slice(page * emojisPerPage, (page + 1) * emojisPerPage);

            emojisPage.forEach(emoji => {
                description += `> <:reply:1320104091795587104> ${emoji} (${emoji.id})\n`; // Muestra el emoji junto con su ID
            });

            // Crea el embed
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: message.author.username, // Nombre del autor
                    iconURL: message.author.displayAvatarURL() // Imagen de perfil del autor
                })
                .setTitle('Emojis')
                .setDescription(description)
                .setColor('#feb926'); // Puedes cambiar el color si lo deseas

            return embed;
        };

        // Crea los botones de navegación
        const createButtons = (page) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 0), // Deshabilita si estamos en la primera página
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === totalPages - 1) // Deshabilita si estamos en la última página
            );
        };

        // Envía el embed con los emojis de la primera página
        const msg = await message.channel.send({
            embeds: [createEmbed(currentPage)],
            components: [createButtons(currentPage)]
        });

        // Interacción con los botones
        const filter = (interaction) => interaction.user.id === message.author.id; // Solo el autor puede interactuar
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 }); // Recolecta interacciones por 1 minuto

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'next') {
                currentPage++;
            } else if (interaction.customId === 'previous') {
                currentPage--;
            }

            // Actualiza el embed con la nueva página
            await interaction.update({
                embeds: [createEmbed(currentPage)],
                components: [createButtons(currentPage)] // Actualiza los botones también
            });
        });

        collector.on('end', async () => {
            // Deshabilitar botones después de que se acabe el tiempo
            await msg.edit({
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('previous').setLabel('Previous').setStyle(ButtonStyle.Primary).setDisabled(true),
                        new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Primary).setDisabled(true)
                    )
                ]
            });
        });
    }
};
