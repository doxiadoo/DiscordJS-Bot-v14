const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roleinfo',
    aliases: ['ri'],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'info',
    run: async (client, message, args, prefix) => {
        // Get the mentioned role or find it by ID
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        
        // Validate role
        if (!args[0] || !role) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | Please provide a valid role.`)]
            });
        }

        // Create the embed
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: `${role.name}'s Information`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addFields([
                {
                    name: '__General Information__',
                    value: `**Role Name**: ${role.name} \n` +
                           `**Role ID**: ${role.id} \n` +
                           `**Role Position**: ${role.rawPosition} / ${message.guild.roles.highest.rawPosition} \n` +
                           `**Role Color**: ${role.hexColor} \n` +
                           `**Role Created**: <t:${Math.round(role.createdTimestamp / 1000)}:R> \n` +
                           `**Hoisted?**: ${role.hoisted ? `${client.emoji.tick}` : `${client.emoji.cross}`} \n` +
                           `**Mentionable?**: ${role.mentionable ? `${client.emoji.tick}` : `${client.emoji.cross}`} \n` +
                           `**Integration**: ${role.manageable ? 'True' : 'False'}`
                },
                {
                    name: '__Allowed Permissions__',
                    value: role.permissions.toArray().sort((a, b) => a.localeCompare(b)).map(x => `\`${x}\``).join(', ') || 'None'
                }
            ])
            .setFooter({ text: `Requested By: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

        // Send the embed
        return message.channel.send({ embeds: [embed] });
    }
};