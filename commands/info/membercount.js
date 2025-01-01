const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'membercount',
    aliases: ['mc'],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'info',
    run: async (client, message, args, prefix) => {
        // Obtener datos del servidor
        const guild = message.guild;
        const totalMembers = guild.memberCount; // Total de miembros
        const humans = guild.members.cache.filter(member => !member.user.bot).size; // Miembros humanos
        const bots = totalMembers - humans; // Bots calculados

        // Crear el embed
        const memberCountEmbed = new EmbedBuilder()
            .setAuthor({
                name: guild.name, // Nombre del servidor
                iconURL: guild.iconURL({ dynamic: true }), // Imagen del servidor
            })
            .setColor("#2B2D31") // Color del embed
            .addFields(
                { name: "Members", value: `${totalMembers}`, inline: true },
                { name: "Humans", value: `${humans}`, inline: true },
                { name: "Bots", value: `${bots}`, inline: true }
            );

        // Enviar el embed
        await message.channel.send({ embeds: [memberCountEmbed] });
    },
};
