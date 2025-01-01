const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about the server.')
        .addStringOption(option =>
            option.setName('server_id')
                .setDescription('The ID of the server to fetch information for.')
                .setRequired(false)
        ),
    async execute(interaction) {
        // Obtener el ID del servidor desde los argumentos o usar el servidor actual
        const guildID = interaction.options.getString('server_id') || interaction.guild.id;
        let guild;

        try {
            // Intentar obtener la información del servidor
            guild = await interaction.client.guilds.fetch(guildID);
        } catch (error) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setDescription(`<:deny:1312884018160599181> The provided ID is not valid or I am not in that server.`)
                ],
                ephemeral: true
            });
        }

        const owner = await guild.fetchOwner();

        // Estadísticas de canales
        const channelCounts = guild.channels.cache.reduce(
            (acc, channel) => {
                if (channel.type === 0) acc.text++;
                else if (channel.type === 2) acc.voice++;
                else if (channel.type === 4) acc.category++;
                return acc;
            },
            { text: 0, voice: 0, category: 0 }
        );

        // Estadísticas de miembros
        const totalMembers = guild.memberCount;
        const botCount = guild.members.cache.filter((member) => member.user.bot).size;
        const humanCount = totalMembers - botCount;

        // Otros datos
        const totalRoles = guild.roles.cache.size;
        const totalEmojis = guild.emojis.cache.size;
        const totalStickers = guild.stickers.cache.size;
        const verifyLevel = getVerificationLevel(guild.verificationLevel);

        const iconURL = guild.iconURL({ dynamic: true, size: 1024 });
        const bannerURL = guild.bannerURL({ dynamic: true, size: 1024 });
        const splashURL = guild.splashURL({ dynamic: true, size: 1024 }) || 'n/a';
        const boostCount = guild.premiumSubscriptionCount || 0;

        const createdTimestamp = Math.floor(guild.createdTimestamp / 1000);

        // Crear embed
        const embedMessage = new EmbedBuilder()
            .setColor('#303237')
            .setAuthor({ name: `${guild.name} (${guild.id})`, iconURL: iconURL })
            .setTitle('Server Information')
            .setThumbnail(iconURL);

        if (guild.description) {
            embedMessage.setDescription(`\n _${guild.description}_\n`);
        }

        embedMessage.addFields(
            {
                name: 'Information',
                value: `> **Owner:** ${owner.user}\n> **Created:** <t:${createdTimestamp}:F>\n> **Verification:** \`${verifyLevel}\``,
                inline: false,
            },
            {
                name: 'Members',
                value: `> **Total:** \`${totalMembers}\`\n> **Humans:** \`${humanCount}\`\n> **Bots:** \`${botCount}\``,
                inline: true,
            },
            {
                name: 'Channels',
                value: `> **Text:** \`${channelCounts.text}\`\n> **Voice:** \`${channelCounts.voice}\`\n> **Categories:** \`${channelCounts.category}\``,
                inline: true,
            },
            {
                name: 'Statistics',
                value: `> **Emojis:** \`${totalEmojis}\`\n> **Stickers:** \`${totalStickers}\`\n> **Roles:** \`${totalRoles}/250\``,
                inline: true,
            },
            {
                name: 'Design',
                value: `> **Icon:** ${iconURL ? `[here](${iconURL})` : 'n/a'}\n> **Banner:** ${
                    bannerURL ? `[here](${bannerURL})` : 'n/a'
                }\n> **Splash:** ${splashURL !== 'n/a' ? `[here](${splashURL})` : 'n/a'}`,
                inline: true,
            },
            {
                name: 'Boosts',
                value: `> **Boosts:** \`${boostCount}\`\n> **Vanity URL:** \`${guild.vanityURLCode ? `${guild.vanityURLCode}` : 'None'}\``,
                inline: true,
            }
        );

        // Si el servidor tiene banner, agregarlo al embed
        if (bannerURL) {
            embedMessage.setImage(bannerURL);
        }

        // Botones opcionales
        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Get Bot')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/oauth2/authorize?client_id=1243644102302630010&permissions=8&integration_type=0&scope=bot+applications.commands'),
            new ButtonBuilder()
                .setLabel('Support')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/WXCD8Mnv4w')
        );

        // Enviar respuesta
        await interaction.reply({ embeds: [embedMessage], components: [actionRow] });
    },
};

// Función para obtener el nivel de verificación en texto
function getVerificationLevel(level) {
    const levels = ['None', 'Low', 'Medium', 'High', 'Very High'];
    return levels[level];
}
