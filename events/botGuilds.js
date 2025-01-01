const { EmbedBuilder } = require('discord.js');

module.exports = async (client) => {
    // Evento cuando el bot es agregado a un nuevo servidor
    client.on('guildCreate', async (guild) => {
        try {
            // Inicialización de datos en las bases de datos correspondientes
            client.data3.set(`whitelist_${guild.id}`, []);
            client.data3.set(`wlEv_${guild.id}`, []);
            client.data3.set(`antiLinks_${guild.id}`, []);

            client.data2.set(`setup_${guild.id}`, 'none');

            let mainChannel;

            // Busca el primer canal donde el bot tiene permisos para enviar mensajes
            guild.channels.cache.forEach((channel) => {
                if (channel.type === 0 && guild.members.me.permissionsIn(channel).has('SendMessages') && !mainChannel) {
                    mainChannel = channel;
                }
            });

            // Si no hay canal principal, no hacer nada
            if (!mainChannel) return;

            // Creación del embed para enviar al canal principal
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({ name: 'Lowest is now in your server!', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`## [Need Help?](https://discord.gg/Gak6Yb5t39)\nJoin our [support server](https://discord.gg/Gak6Yb5t39) for help`)
                .addFields(
                    { name: "Lowest's default prefix is set to `,`", value: '> To change the prefix use `,prefix set (prefix)`\n> Ensure the bot\'s role is within the guild\'s top 5 roles for lowest to function correctly', inline: false },
                    { name: 'Commands to help you get started:', value: '> **,setup** - Creates a jail and log channel along with the jail role\n> **,antinuke** - Creates the antinuke setup to keep your server safe', inline: false }
                );

            // Envía el mensaje embed al canal principal
            mainChannel.send({ embeds: [embed] });

            // Obtener información del dueño del servidor
            const owner = await guild.fetchOwner();
            
            // Crear una invitación para el servidor
            const invite = await mainChannel.createInvite({ maxAge: 0, reason: 'Creating invite for my developer(s)' });

            // Creación del embed para el log de creación de un nuevo servidor
            const emb = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({ name: '| New Guild Created!', iconURL: guild.iconURL({ dynamic: true }) })
                .addFields([
                    { name: '**Server Name**', value: guild.name },
                    { name: '**Server ID**', value: guild.id },
                    { name: '**Owner Info**', value: owner ? owner.user.tag : 'Unknown User' },
                    { name: '**Member Count**', value: `${guild.memberCount} Members` },
                    { name: '**Invite**', value: `https://discord.gg/${invite.code}` },
                    { name: '**Guild Created**', value: `<t:${Math.round(guild.createdTimestamp / 1000)}:R>` },
                    { name: '**Guild Joined**', value: `<t:${Math.round(guild.joinedTimestamp / 1000)}:R>` },
                    { name: `${client.user.username}'s Server Count`, value: `${client.guilds.cache.size}` },
                    { name: `${client.user.username}'s Users Count`, value: `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}` },
                ])
                .setTimestamp();

            // Envía el log de creación de servidor en el canal de logs configurado
            client.channels.cache.get(client.config.guildLogs).send({ embeds: [emb] });
        } catch (error) {
            console.error('Error en guildCreate:', error);
        }
    });

    // Evento cuando el bot es eliminado de un servidor
    client.on('guildDelete', async (guild) => {
        try {
            // Creación del embed para el log de eliminación de un servidor
            const emb = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({ name: '| Guild Deleted!', iconURL: guild.iconURL({ dynamic: true }) })
                .addFields([
                    { name: '**Server Name**', value: guild.name },
                    { name: '**Server ID**', value: guild.id },
                    { name: '**Member Count**', value: `${guild.memberCount} Members` },
                    { name: '**Guild Created**', value: `<t:${Math.round(guild.createdTimestamp / 1000)}:R>` },
                    { name: `${client.user.username}'s Server Count`, value: `${client.guilds.cache.size}` },
                    { name: `${client.user.username}'s Users Count`, value: `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}` },
                ])
                .setTimestamp();

            // Envía el log de eliminación de servidor en el canal de logs configurado
            client.channels.cache.get(client.config.guildLogs).send({ embeds: [emb] });
        } catch (error) {
            console.error('Error en guildDelete:', error);
        }
    });
};
