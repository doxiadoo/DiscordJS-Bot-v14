const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const os = require('os');

module.exports = {
    name: 'botinfo',
    aliases: ['abo', 'about', 'bi'],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'info',
    run: async (client, message, args, prefix) => {
        // Función para contar las líneas totales de código
        const countLines = (dir) => {
            const files = fs.readdirSync(dir, { withFileTypes: true });
            return files.reduce((total, file) => {
                if (file.isDirectory()) {
                    return total + countLines(`${dir}/${file.name}`);
                } else if (file.name.endsWith('.js')) {
                    const content = fs.readFileSync(`${dir}/${file.name}`, 'utf8');
                    return total + content.split('\n').length;
                }
                return total;
            }, 0);
        };

        // Función para calcular la edad en años y meses con timestamp
        const calculateAgeTimestamp = (timestamp) => {
            const createdDate = new Date(timestamp);
            const now = new Date();

            const totalMonths = (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth());
            const years = Math.floor(totalMonths / 12);
            const months = totalMonths % 12;

            return `${years} year(s) and ${months} month(s)`;
        };

        const totalLines = countLines('./src'); // Ajustar la ruta a la carpeta del bot
        const botId = args[0]; // Se toma el ID del bot como argumento

        if (!botId) {
            // Información principal del bot (si no se da otro ID)
            const totalCommands = client.commands.size;
            const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            const totalGuilds = client.guilds.cache.size;

            const cpuUsage = (os.loadavg()[0] * 100 / os.cpus().length).toFixed(2); // Carga promedio de CPU en %
            const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2); // Memoria en GB
            const botLaunchedAt = `<t:${Math.floor((Date.now() - client.uptime) / 1000)}:R>`;
            const botCreatedAt = `<t:${Math.floor(client.user.createdTimestamp / 1000)}:R>`; // Ahora no incluye la edad del bot

            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({
                    name: `${client.user.username}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`Developed and maintained by [d](https://discord.com/users/763141886834769980), [zamu](https://discord.com/users/410887200436256768)\nUtilizing \`${client.commands.size}\` commands\nWritten in \`${totalLines}\` lines of JavaScript.`)
                .addFields(
                    {
                        name: 'Bot',
                        value: `> **Users**: \`${totalMembers}\`\n> **Servers**: \`${totalGuilds}\`\n> **Created**: ${botCreatedAt}`,
                        inline: true
                    },
                    {
                        name: 'System',
                        value: `> **CPU**: \`${cpuUsage}%\`\n> **Memory**: \`${memoryUsage} GB\`\n> **Launched**: ${botLaunchedAt}`,
                        inline: true
                    }
                )
                .setFooter({ text: `lowest/v2.4 • Lasted Commit: h6f0067` });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Github').setURL('https://github.com/doxiadoo'),
                    new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Support').setURL(client.config.support_server_link),
                    new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Invite').setURL('https://discord.com/oauth2/authorize?client_id=1090740464786886657&scope=bot+applications.commands&permissions=142')
                );

            return message.channel.send({ embeds: [embed], components: [row] });
        }

        // Otra información del bot
        try {
            const botUser = await client.users.fetch(botId);
            if (!botUser.bot) return message.reply('The provided ID does not belong to a bot.');

            const response = await axios.get(`https://discord.com/api/v10/applications/${botUser.id}/rpc`, {
                headers: { Authorization: `Bot ${client.token}` },
            });

            const aboutMe = response.data.description || 'No description available.';
            const terms = response.data.terms_of_service_url || 'No Terms of Service available.';
            const privacy = response.data.privacy_policy_url || 'No Privacy Policy available.';

            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({ name: botUser.username, iconURL: botUser.displayAvatarURL() })
                .setThumbnail(botUser.displayAvatarURL())
                .setDescription(`${aboutMe}`)
                .addFields(
                    { name: 'Links', value: `> [Terms of Service](${terms})\n> [Privacy Policy](${privacy})`, inline: true },
                    { name: 'Bot', value: `> Application is public.\n> [Invite ${botUser.username}](https://discord.com/oauth2/authorize?client_id=${botId}&scope=bot+applications.commands&permissions=70368744177655)`, inline: true }
                );

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Add to Server')
                        .setURL(`https://discord.com/oauth2/authorize?client_id=${botId}&scope=bot+applications.commands&permissions=70368744177655`)
                );

            return message.channel.send({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error(`[BotInfo Error]: ${error.message}`);
            return message.reply('An error occurred while retrieving the bot information.');
        }
    },
};
