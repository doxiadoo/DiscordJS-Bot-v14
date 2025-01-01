const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'invite',
    aliases: ['inv'],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'info',
    run: async (client, message, args, prefix) => {

        return message.channel.send({
            content: 'https://discord.com/application-directory/1243644102302630010',
        });
    }
};