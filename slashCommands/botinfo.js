const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); // Import axios for making HTTP requests

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Displays information about lowest.')
        .addStringOption(option =>
            option.setName('botid')
                .setDescription('The ID of the bot you want information about')
                .setRequired(false)),

    async execute(interaction) {
        const specifiedBotId = '1090740464786886657';
        const botId = interaction.options.getString('botid');

        if (!botId || botId === specifiedBotId) {
            const latency = interaction.client.ws.ping;
            const totalCommands = interaction.client.commands.size;
            const totalGuilds = interaction.client.guilds.cache.size;

            let totalMembers = 0;
            let totalOnline = 0;
            let totalTextChannels = 0;
            let totalVoiceChannels = 0;
            let totalCategories = 0;

            // Solo calcula estadísticas de servidores si está en un servidor
            if (interaction.guild) {
                totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
                totalOnline = interaction.client.guilds.cache.reduce(
                    (acc, guild) => acc + guild.members.cache.filter(member => member.presence?.status === 'online').size,
                    0
                );
                totalTextChannels = interaction.client.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size;
                totalVoiceChannels = interaction.client.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size;
                totalCategories = interaction.client.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY').size;
            }

            const totalSeconds = Math.floor(interaction.client.uptime / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const embed = {
                color: '#2f3136',
                author: {
                    name: `${interaction.client.user.username}`,
                    iconURL: interaction.client.user.displayAvatarURL(),
                },
                thumbnail: {
                    url: interaction.client.user.displayAvatarURL(),
                },
                description: `Free multi-purpose Discord bot made by the [Lowest Team](https://discord.gg/Gak6Yb5t39)
${interaction.guild ? `Used by **${totalMembers}** members in **${totalGuilds}** servers.` : `Used in **${totalGuilds}** servers.`}`,
                fields: [
                    ...(interaction.guild
                        ? [
                            {
                                name: 'Members',
                                value: `> **Total**: ${totalMembers}\n> **Online**: ${totalOnline}`,
                                inline: true,
                            },
                            {
                                name: 'Channels',
                                value: `> **Text**: ${totalTextChannels}\n> **Voice**: ${totalVoiceChannels}\n> **Categories**: ${totalCategories}`,
                                inline: true,
                            },
                        ]
                        : []),
                    {
                        name: 'System',
                        value: `> **Commands**: ${totalCommands}\n> **Lowest**: v1.0.0\n> **Library**: [Node.js](https://nodejs.org/)`,
                        inline: true,
                    }
                ],
                footer: {
                    text: `Uptime: ${hours} hours, ${minutes} minutes and ${seconds} seconds`,
                }
            };

            const supportButton = {
                type: 2,
                style: 5,
                label: 'Invite',
                url: 'https://discord.com/oauth2/authorize?client_id=1090740464786886657&scope=bot+applications.commands&permissions=142',
            };

            const inviteButton = {
                type: 2,
                style: 5,
                label: 'Support Server',
                url: interaction.client.config?.support_server_link || 'https://discord.gg/Gak6Yb5t39',
            };

            const row = {
                type: 1,
                components: [supportButton, inviteButton],
            };

            return interaction.reply({ embeds: [embed], components: [row] });
        }

        // If a different bot ID is provided
        try {
            const botUser = await interaction.client.users.fetch(botId);

            if (!botUser.bot) return interaction.reply('The provided ID does not belong to a bot.');

            const response = await axios.get(`https://discord.com/api/v10/applications/${botUser.id}/rpc`, {
                headers: {
                    Authorization: `Bot ${interaction.client.token}`, // Authentication with the bot's token
                }
            });

            const aboutMe = response.data.description || 'No information available';

            const embed = {
                color: '#2f3136',
                author: {
                    name: botUser.username,
                    iconURL: botUser.displayAvatarURL(),
                },
                thumbnail: {
                    url: botUser.displayAvatarURL(),
                },
                description: `${aboutMe}`,
                fields: [
                    {
                        name: 'Links',
                        value: `> [Terms of Service](${response.data.terms_of_service_url || 'No TOS available'})\n> [Privacy Policy](${response.data.privacy_policy_url || 'No Privacy Policy available'})`,
                        inline: true,
                    },
                    {
                        name: 'Bot',
                        value: `> Application is public.\n> [Invite ${botUser.username}](https://discord.com/oauth2/authorize?client_id=${botId}&scope=bot+applications.commands&permissions=70368744177655)`,
                        inline: true,
                    }
                ]
            };

            const addToServerButton = {
                type: 2,
                style: 5,
                label: 'Add to Server',
                url: `https://discord.com/oauth2/authorize?client_id=${botId}&scope=bot+applications.commands&permissions=70368744177655`,
            };

            const row = {
                type: 1,
                components: [addToServerButton],
            };

            return interaction.reply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error(error);
            return interaction.reply('An error occurred while trying to get the bot information.');
        }
    }
};
