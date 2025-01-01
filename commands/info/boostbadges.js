const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'boostbadges',
    aliases: ['bb'],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'info',
    run: async (client, message, args, prefix) => {
        // Create the embed
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Boost Badges')
            .setImage('https://support.discord.com/hc/article_attachments/10928413771031'); // URL for the boost badges image

        // Send the embed
        return message.channel.send({ embeds: [embed] });
    }
};