const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'uptime',
    aliases: ['upt'],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'info',
    run: async (client, message, args, prefix) => {
        // Calcular el uptime en formato legible usando el marcador de tiempo Discord
        const botUptime = `<t:${Math.floor((Date.now() - client.uptime) / 1000)}:R>`; // Uptime (active time)

        // Crear el embed con la mención al usuario
        const uptimeEmbed = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<:info:1320071736670294046> ${message.author.toString()}: lowest has been up for ${botUptime}`); // Mención al usuario y uptime

        // Responde directamente al mensaje del usuario
        return message.reply({ embeds: [uptimeEmbed] });
    }
};
