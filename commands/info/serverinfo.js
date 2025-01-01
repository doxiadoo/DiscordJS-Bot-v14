const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'serverinfo',
    aliases: ['si', 'serverinfo', 'server'],
    cat: 'info',
    run: async (client, message, args) => {
        // Check for EmbedLinks permission
        if (!message.guild.members.me.permissionsIn(message.channel).has('EmbedLinks')) {
            return message.channel.send(
                '<:warning:1320071921001566269> I do not have permission to send embedded messages in this channel. Please ensure I have the **Embed Links** permission.'
            );
        }

        const guildID = args[0] || message.guild.id;
        let guild;

        try {
            // Fetch the guild information
            guild = await client.guilds.fetch(guildID);
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setDescription(`<:deny:1320071905453277275> The provided ID is not valid or I am not in that server.`)
                ]
            });
        }

        const owner = await guild.fetchOwner();

        // Channel statistics
        const channelCounts = guild.channels.cache.reduce(
            (acc, channel) => {
                if (channel.type === 0) acc.text++;
                else if (channel.type === 2) acc.voice++;
                else if (channel.type === 4) acc.category++;
                return acc;
            },
            { text: 0, voice: 0, category: 0 }
        );

        // Member statistics
        const totalMembers = guild.memberCount;
        const botCount = guild.members.cache.filter((member) => member.user.bot).size;
        const humanCount = totalMembers - botCount;

        // Other statistics
        const totalRoles = guild.roles.cache.size;
        const totalEmojis = guild.emojis.cache.size;
        const totalStickers = guild.stickers.cache.size;
        const verifyLevel = getVerificationLevel(guild.verificationLevel);

        const iconURL = guild.iconURL({ dynamic: true, size: 1024 });
        const bannerURL = guild.bannerURL({ dynamic: true, size: 1024 });
        const splashURL = guild.splashURL({ dynamic: true, size: 1024 }) || 'n/a';
        const boostCount = guild.premiumSubscriptionCount || 0;

        const createdTimestamp = Math.floor(guild.createdTimestamp / 1000);

        // Create embed
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

        // If the server has a banner, set it as the embed image
        if (bannerURL) {
            embedMessage.setImage(bannerURL);
        }

        // Optional buttons
        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Get Bot')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/oauth2/authorize?client_id=1090740464786886657&scope=bot+applications.commands&permissions=142'),
            new ButtonBuilder()
                .setLabel('Support')
                .setStyle(ButtonStyle.Link)
                .setURL(client.config.support_server_link)
        );

        // Send message
        await message.channel.send({ embeds: [embedMessage], components: [actionRow] });
    },
};

// Function to get verification level in text
function getVerificationLevel(level) {
    const levels = ['None', 'Low', 'Medium', 'High', 'Very High'];
    return levels[level];
}
