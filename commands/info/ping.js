const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["Latency", "Ping", "latency"],
    cat: "info",
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`> ${message.author.toString()}: latency is \`${client.ws.ping}ms\``);

        message.channel.send({ embeds: [embed] });
    }
};