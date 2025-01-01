const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require("discord.js");

module.exports = async (client) => {
    client.on("messageCreate", async (message) => {
        if (!message.guild || message.author.bot) return;

        // Check if a specific user is mentioned
        const specificUserId = '1243644102302630010'; // Replace this with the user ID you're targeting
        if (message.mentions.has(specificUserId)) {
            const warningMessage = `${client.emoji.warning} **we no longer offer a free option for lowest.**\n> ping our main bot \`lowest#5272\` for its prefix and other information.`;
            
            return message.channel.send(warningMessage); // Send the plain text message
        }

        let prefix = client.config.prefix;
        let prefixData = await client.data.get(`prefix_${message.guild.id}`);
        if (!prefixData) {
            prefix = client.config.prefix;
        } else if (prefixData) {
            prefix = prefixData;
        }

        if (message.content === `<@${client.user.id}>`) {
            const b1 = new ButtonBuilder().setLabel("Invite").setStyle(ButtonStyle.Link).setURL(`https://discord.com/oauth2/authorize?client_id=1243644102302630010&scope=bot+applications.commands&permissions=142`);
            const b2 = new ButtonBuilder().setLabel("Support").setStyle(ButtonStyle.Link).setURL("https://discord.gg/WXCD8Mnv4w");
            const row = new ActionRowBuilder().addComponents(b1, b2);
            
            const emb = new EmbedBuilder()
                .setColor(`#2f3136`)
                .setTitle(`🪄 ▸ Prefix`)
                .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setDescription(
                    `> My prefix for the server: \`${prefix}\`
                     > You can use \`${prefix}help\` or </help:1288183574398505011> to see all my commands.`
                )
                .setThumbnail(message.guild.iconURL({ dynamic: true }));
            
            return message.channel.send({ embeds: [emb], components: [row] }).catch((e) => { console.log(e) });
        }

        const botregex = RegExp(`^<@!?${client.user.id}>( |)`);
        let pre = message.content.match(botregex) ? message.content.match(botregex)[0] : prefix;
        if (!message.content.startsWith(pre)) return;

        const args = message.content.slice(pre.length).trim().split(/ +/);
        const cmnd = args.shift().toLowerCase();
        const cmd = client.commands.get(cmnd) || client.commands.find((c) => c.aliases && c.aliases.includes(cmnd));
        if (!cmd) return;

        // Permission checks
        if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ViewChannel)) {
            return message.author.send({
                embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`${client.emoji.cross} **|** I don't have \`VIEW_CHANNEL\` Permissions in that channel`)]
            }).catch(() => { });
        }
        if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages)) {
            return message.author.send({
                embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`${client.emoji.cross} **|** I don't have \`SEND_MESSAGES\` permissions in that channel.`)]
            }).catch(() => { });
        }
        if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.EmbedLinks)) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`${client.emoji.cross} **|** I don't have \`EMBED_LINKS\` permissions in this channel.`)]
            });
        }
        if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.UseExternalEmojis)) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`${client.emoji.cross} **|** I don't have \`USE_EXTERNAL_EMOJIS\` permissions in this channel.`)]
            });
        }

        if (cmd.punitop && !client.config.owner.includes(message.author.id)) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`${client.emoji.cross} **|** This command is an owner command. You cannot use this.`)]
            });
        }

        // Admin permit checks
        if (cmd.adminPermit) {
            let adminData = [
                await client.data.get(`adminPermit1_${message.guild.id}`),
                await client.data.get(`adminPermit2_${message.guild.id}`),
                await client.data.get(`adminPermit3_${message.guild.id}`),
                await client.data.get(`adminPermit4_${message.guild.id}`),
                await client.data.get(`adminPermit5_${message.guild.id}`)
            ];

            let ownerData = [
                await client.data.get(`ownerPermit1_${message.guild.id}`),
                await client.data.get(`ownerPermit2_${message.guild.id}`)
            ];

            if (!client.config.owner.includes(message.author.id) && !adminData.includes(message.author.id) && message.guild.ownerId !== message.author.id && !ownerData.includes(message.author.id)) {
                return message.channel.send({
                    embeds: [new EmbedBuilder().setColor(`#2f3136`).setAuthor({ name: `| Unauthorized`, iconURL: message.guild.iconURL({ dynamic: true }) }).setDescription(`${client.emoji.cross} You need my Admin Permit to run this command.`)]
                });
            }
        }

        // Owner permit checks
        if (cmd.ownerPermit) {
            let ownerData = [
                await client.data.get(`ownerPermit1_${message.guild.id}`),
                await client.data.get(`ownerPermit2_${message.guild.id}`)
            ];

            if (!client.config.owner.includes(message.author.id) && !ownerData.includes(message.author.id) && message.guild.ownerId !== message.author.id) {
                return message.channel.send({
                    embeds: [new EmbedBuilder().setColor(`#2f3136`).setAuthor({ name: `| Unauthorized`, iconURL: message.guild.iconURL({ dynamic: true }) }).setDescription(`${client.emoji.cross} You need my Owner Permit to run this command.`)]
                });
            }
        }

        // Command cooldowns
        if (!client.config.owner.includes(message.author.id)) {
            if (!client.cools.has(cmd.name)) {
                client.cools.set(cmd.name, new Collection());
            }
            const now = Date.now();
            const ts = client.cools.get(cmd.name);
            const cool = (cmd.cool || 3) * 1000;
            if (ts.has(message.author.id)) {
                let exp = ts.get(message.author.id) + cool;
                if (now < exp) {
                    let time = (exp - now) / 1000;
                    return message.channel.send({
                        embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You are being **Rate-Limited** Please wait till \`${time.toFixed(1)}s\``)]
                    }).then(m => { setTimeout(() => { m.delete() }, 6000) });
                }
            }
            ts.set(message.author.id, now);
        }

        await cmd.run(client, message, args, prefix).catch((e) => { console.log(e) });
    });

    // Check if the author is AFK
    client.on("messageCreate", async (message) => {
        if (message.author.bot || !client.afkUsers) return;

        // Check if the author is AFK
        if (client.afkUsers.has(message.author.id)) {
            client.afkUsers.delete(message.author.id);

            const embed = new EmbedBuilder()
                .setColor("#2f3136")
                .setDescription("<:approve:1312884005359714456> Welcome back! Your AFK status has been removed.");

            await message.reply({ embeds: [embed] });
        }

        // Check if an AFK user is mentioned
        const mentionedUsers = message.mentions.users;
        mentionedUsers.forEach((user) => {
            if (client.afkUsers.has(user.id)) {
                const afkData = client.afkUsers.get(user.id);

                const embed = new EmbedBuilder()
                    .setColor("#2f3136")
                    .setDescription(
                        `<:warning:1312884332859494400> **${user.tag}** is currently AFK: **${afkData.message}**\n` +
                        `Since: <t:${Math.floor(afkData.since / 1000)}:R>`
                    );

                message.reply({ embeds: [embed] }).catch(() => null);
            }
        });
    });
};
