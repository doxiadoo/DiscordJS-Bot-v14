const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'legacybadges',
    aliases: ['legacyb'],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'info',
    run: async (client, message, args, prefix) => {
        // Create the embed
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Legacy Badges')
            .setImage('https://betterdiscord.app/Image/667'); // URL for the legacy badges image

        // Send the embed
        return message.channel.send({ embeds: [embed] });
    }
};