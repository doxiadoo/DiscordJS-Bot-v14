const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report an issue to the support channel.'),
    
    async execute(interaction) {
        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('reportModal')
            .setTitle('Submit Report');

        // Create the message input
        const messageInput = new TextInputBuilder()
            .setCustomId('messageInput')
            .setLabel('Message (Required)')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        // Create the image link input (optional)
        const imageInput = new TextInputBuilder()
            .setCustomId('imageInput')
            .setLabel('Image Link (Optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        // Add inputs to action rows
        const firstActionRow = new ActionRowBuilder().addComponents(messageInput);
        const secondActionRow = new ActionRowBuilder().addComponents(imageInput);

        // Add action rows to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};

// Function to handle modal submission
module.exports.modalSubmit = async (client, interaction) => {
    if (!interaction.isModalSubmit()) return;

    // Check if the modal ID is 'reportModal'
    if (interaction.customId === 'reportModal') {
        const reportContent = interaction.fields.getTextInputValue('messageInput');
        const imageUrl = interaction.fields.getTextInputValue('imageInput');

        // Define the support channel ID
        const supportChannelId = '1279843435435655308'; // Cambia esto por el ID de tu canal de soporte
        const supportChannel = await client.channels.fetch(supportChannelId);

        // Check if the channel exists and is a text channel
        if (!supportChannel || supportChannel.type !== 'GUILD_TEXT') {
            const channelNotFoundEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('El canal de soporte no se encuentra o no es un canal de texto.')
                .setTimestamp();

            return await interaction.reply({ embeds: [channelNotFoundEmbed], ephemeral: true });
        }

        // Create the report embed
        const reportEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Nuevo Reporte')
            .setDescription(reportContent)
            .addFields(
                { name: 'Reportado por', value: interaction.user.tag, inline: true },
                { name: 'ID del Reportador', value: interaction.user.id, inline: true }
            )
            .setTimestamp();

        // Check if an image link was provided and add it to the embed if it exists
        if (imageUrl) {
            reportEmbed.setImage(imageUrl);
        }

        // Send the report to the support channel
        await supportChannel.send({ embeds: [reportEmbed] });

        // Confirm the report has been sent to the user
        const confirmationEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('Reporte Enviado')
            .setDescription('Tu reporte ha sido enviado al canal de soporte.')
            .setTimestamp();

        // Use reply instead of followUp, since this is the first response to the interaction
        await interaction.reply({ embeds: [confirmationEmbed] });
    }
};
