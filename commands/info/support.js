const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "support",
    aliases: [],
    punitop: false,
    cat: 'info',
    adminPermit: false,
    ownerPermit: false,
    run: async (client, message, args, prefix) => {
        const supportEmbed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Need Help?')
            .setDescription(`> If you need assistance or have any questions, feel free to join our support server!`);

        const supportButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Join Support Server')
            .setURL(client.config.support_server_link);

        const actionRow = new ActionRowBuilder()
            .addComponents(supportButton);

        return message.channel.send({ embeds: [supportEmbed], components: [actionRow] });
    }
};