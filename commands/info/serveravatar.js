const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'serveravatar',
    aliases: ['serverav', 'servericon', 'sav'],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'info',
    run: async (client, message, args, prefix) => {
        // Get the server icon URL
        const serverIconURL = message.guild.iconURL({ dynamic: true, size: 512 });

        // Create the embed
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setImage(serverIconURL)
            .setAuthor({ name: `${message.guild.name}'s Server Icon`, iconURL: serverIconURL });

        // Send the embed
        return message.channel.send({ embeds: [embed] });
    }
};