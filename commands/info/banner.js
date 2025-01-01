const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'banner',
    aliases: [],
    punitop: false,
    cat: 'info',
    adminPermit: false,
    ownerPermit: false,
    run: async (client, message, args, prefix) => {
        try {
            const userArg = args[0];

            if (userArg?.toLowerCase() === 'server') {
                // Get server banner
                const guild = message.guild;
                if (!guild.banner) {
                    const noBannerEmbed = new EmbedBuilder()
                        .setDescription('❌ This server does not have a banner.')
                        .setColor('#2B2D31');
                    return message.reply({ embeds: [noBannerEmbed] });
                }

                // Check if the server banner is animated (starts with "a_")
                const bannerExtension = guild.banner.startsWith('a_') ? 'gif' : 'png';
                const bannerUrl = `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.${bannerExtension}?size=4096`;

                const embed = new EmbedBuilder()
                    .setTitle(`Server Banner: ${guild.name}`)
                    .setImage(bannerUrl)
                    .setColor('#2B2D31');
                return message.reply({ embeds: [embed] });
            }

            // Get user (by mention, ID, or the message author)
            const targetUser = userArg
                ? await message.guild.members.fetch(userArg.replace(/[<@!>]/g, '')).then(member => member.user).catch(() => null)
                : message.author;

            if (!targetUser) {
                const notFoundEmbed = new EmbedBuilder()
                    .setDescription('❌ Could not find the specified user.')
                    .setColor('#2B2D31');
                return message.reply({ embeds: [notFoundEmbed] });
            }

            // Get user's banner
            const user = await client.users.fetch(targetUser.id, { force: true });
            if (!user.banner) {
                const noUserBannerEmbed = new EmbedBuilder()
                    .setDescription(
                        `❌ ${
                            user.id === message.author.id
                                ? 'You do not have a banner.'
                                : `${user.username} does not have a banner.`
                        }`
                    )
                    .setColor('#2B2D31');
                return message.reply({ embeds: [noUserBannerEmbed] });
            }

            // Build banner URL
            const bannerExtension = user.banner.startsWith('a_') ? 'gif' : 'png'; // Check if it's a GIF or PNG
            const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${bannerExtension}?size=4096`;

            // Create embed
            const embed = new EmbedBuilder()
                .setTitle(`Banner of ${user.username}`)
                .setImage(bannerUrl)
                .setColor('#2B2D31');
            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setDescription('❌ An error occurred while trying to execute this command.')
                .setColor('#2B2D31');
            return message.reply({ embeds: [errorEmbed] });
        }
    }
};
