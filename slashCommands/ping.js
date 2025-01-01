const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('...'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#2f3136') // Puedes cambiar el color a tu preferencia
            .setDescription(`> ${message.author.toString()}: latency is \`${interaction.client.ws.ping}ms\``);

        await interaction.reply({ embeds: [embed] });
    }
};
