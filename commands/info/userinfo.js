const { profileImage } = require('discord-arts');
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder } = require("discord.js");
const axios = require('axios');

module.exports = {
    name: 'userinfo',
    aliases: ['ui', 'whois'],
    cat: 'info',
    description: "Get info about your account, mentioned user's account, or a user by ID!",

    run: async (client, message, args) => {
        await message.channel.sendTyping();

        let mentionedMember;

        if (args[0]) {
            const mention = message.mentions.members.first();
            if (mention) {
                mentionedMember = mention;
            } else {
                try {
                    const fetchedUser = await client.users.fetch(args[0]);
                    const guildMember = message.guild.members.cache.get(fetchedUser.id) || null;
                    mentionedMember = guildMember ? guildMember : { user: fetchedUser };
                } catch (error) {
                    return message.reply("<:deny:1320071905453277275> Invalid ID or user not found.");
                }
            }
        } else {
            mentionedMember = message.member;
        }

        // No es necesario restringir el comando solo al servidor específico
        // Reemplaza con el ID del servidor donde los roles están definidos si es necesario
        const serverID = '720387763127451769';

        if (mentionedMember) {
            const user = mentionedMember.user || mentionedMember;

            // Mapa de insignias
            const badgeToEmojiMap = {
                'ACTIVE_DEVELOPER': '<:activedeveloper:1320072333402308669>',
                'APPLICATION_AUTOMOD': '<:automod:1320072220910813225>',
                'APPLICATION_STORE': '<:premiumbot:1320072526390362143>',
                'BUGHUNTER_LEVEL_1': '<:discordbughunter1:1320072420303962112>',
                'BUGHUNTER_LEVEL_2': '<:discordbughunter2:1320072409042124820>',
                'DISCORD_CERTIFIED_MODERATOR': '<:discordmod:1320072395595321434>',
                'DISCORD_EMPLOYEE': '<:discordstaff:1320072459457789963>',
                'EARLY_SUPPORTER': '<:discordearlysupporter:1320072380500152390>',
                'EARLY_VERIFIED_BOT_DEVELOPER': '<:discordbotdev:1320072432450539573>',
                'HOUSE_BALANCE': '<:hypesquadbalance:1320072295032819772>',
                'HOUSE_BRAVERY': '<:hypesquadbravery:1320072306256515123>',
                'HOUSE_BRILLIANCE': '<:hypesquadbrilliance:1320072281384423444>',
                'HYPESQUAD_EVENTS': '<:HypesquadEvents_Badge:1289636340903837707>',
                'LEGACY_USERNAME': '<:username:1320072492739596379>',
                'NITRO': '<:discordnitro:1320072736860541019>',
                'PARTNERED_SERVER_OWNER': '<:discordpartner:1320072366444904610>',
                'APPLICATION_COMMAND': '<:supportscommands:1320072207766126685>',
                'QUEST_COMPLETED': '<:quest:1320072507482574971>',
                'NITRO_BRONZE': '<:bronze:1320072870948241458>',
                'NITRO_SILVER': '<:silver:1320072756678627348>',
                'NITRO_GOLD': '<:gold:1320072839553876029>',
                'NITRO_PLATINUM': '<:platinum:1320072783882879067>',
                'NITRO_DIAMOND': '<:diamond:1320072889520885932>',
                'NITRO_EMERALD': '<:emerald:1320072856133959921>',
                'NITRO_RUBY': '<:ruby:1320072805458513991>',
                'NITRO_FIRE': '<:fire:1320072824127492156>',
                'BOOSTER_1': '<:discordboost1:1320072559756316714>',
                'BOOSTER_2': '<:discordboost2:1320072576277545102>',
                'BOOSTER_3': '<:discordboost3:1320072593658613911>',
                'BOOSTER_6': '<:discordboost4:1320072611430006804>',
                'BOOSTER_9': '<:discordboost5:1320072639309545512>',
                'BOOSTER_12': '<:discordboost6:1320072694808580098>',
                'BOOSTER_15': '<:discordboost7:1320072659056464023>',
                'BOOSTER_18': '<:discordboost8:1320072674546024458>',
                'BOOSTER_24': '<:discordboost9:1320072706863136808>',
            };

            let userBadges = 'No badges';
            try {
                const response = await axios.get(`https://discord-arts.asure.dev/v1/user/${user.id}`);
                const data = response.data;

                if (data && data.data && data.data.assets && data.data.assets.badges) {
                    userBadges = data.data.assets.badges
                        .map(badge => badgeToEmojiMap[badge.name] || ' ')
                        .filter(Boolean)
                        .join(' ') || 'No badges';
                }
            } catch (error) {
                userBadges = (user.flags ? user.flags.toArray() : [])
                    .map(flag => badgeToEmojiMap[flag])
                    .filter(Boolean)
                    .join(' ') || 'No badges';
            }

            // Emojis para los roles
            const roleEmojis = {
                '1314610007001534566': '<:owner_bot:1320197667606761564>',
                '1314610007672885349': '<:developer:1320071837840969801>',
                '1314610017130905720': '<:manager:1320199206006423693>',
                '1314610010248183890': '<:staff:1320071813132324965>',
                '1314610025112666123': '<:donator:1320071781071061062>',
            };

            let roleEmojisToShow = [];
            for (const [roleId, emoji] of Object.entries(roleEmojis)) {
                // Verifica si el usuario tiene el rol en el servidor especificado
                const guild = client.guilds.cache.get(serverID);
                const guildMember = guild ? guild.members.cache.get(user.id) : null;
                if (guildMember && guildMember.roles.cache.has(roleId)) {
                    roleEmojisToShow.push(emoji);
                }
            }

            let emojiToShow = roleEmojisToShow.join(' ') || '';
            userBadges += ` ∙ ${emojiToShow}`;

            let imageAttachment;
            try {
                const profileBuffer = await profileImage(user.id, {
                    presenceStatus: 'online',
                    moreBackgroundBlur: true,
                    backgroundBrightness: 100,
                });
                imageAttachment = new AttachmentBuilder(profileBuffer, { name: 'profile.png' });
            } catch (error) {
                console.error('Error generating profile image:', error);
            }

            const sharedGuilds = client.guilds.cache.filter(guild => guild.members.cache.has(user.id)).size;

            let joinPosition = 'Not applicable';
            if (mentionedMember.joinedAt) {
                const sortedMembers = message.guild.members.cache
                    .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                    .map(member => member.id);
                joinPosition = sortedMembers.indexOf(mentionedMember.id) + 1;
            }

            const userEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${user.username} (${user.id})`,
                    iconURL: user.displayAvatarURL({ dynamic: true })
                })
                .setThumbnail(user.displayAvatarURL())
                .setColor('#2B2D31')
                .addFields(
                    { name: 'Badges', value: userBadges, inline: false },
                    { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                    mentionedMember.joinedAt
                        ? { name: 'Joined', value: `<t:${Math.floor(mentionedMember.joinedAt.getTime() / 1000)}:R>`, inline: true }
                        : { name: 'Joined', value: 'Not a member of this server.', inline: true }
                )
                .setFooter({
                    text: `Join position: ${joinPosition} ∙ Mutual Servers: ${sharedGuilds}`,
                });

            if (imageAttachment) {
                userEmbed.setImage("attachment://profile.png");
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('roles')
                        .setLabel('Roles')
                        .setStyle('Secondary'),
                    new ButtonBuilder()
                        .setCustomId('avatar')
                        .setLabel('Avatar')
                        .setStyle('Secondary'),
                    new ButtonBuilder()
                        .setCustomId('banner')
                        .setLabel('Banner')
                        .setStyle('Secondary')
                );

            await message.reply({ embeds: [userEmbed], files: imageAttachment ? [imageAttachment] : [], components: [row] });
        }
    }
};
