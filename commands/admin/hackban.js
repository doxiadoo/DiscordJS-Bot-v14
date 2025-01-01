const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'hackban',
    aliases: ["fuckban", "fuck", "fban"],
    punitop: false,
    adminPermit: true,
    ownerPermit: false,
    cat: 'admin',
    run: async (client, message, args, prefix) => {
        // Check if arguments are provided
        if (!args[0]) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | Command Usage: \`${prefix}hackban <user> [reason]\``)
                ]
            });
        }

        // Get user ID or mentioned member
        let user = args[0] || message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        let reason = args.slice(1).join(' ') || 'No reason given';

        if (!user) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | Please provide a valid user.`)
                ]
            });
        }

        // Prevent actions on server owner, bot owner, or the command executor
        if (user.id === message.guild.ownerId) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | You cannot ban the Server Owner.`)
                ]
            });
        }

        if (client.config.owner.includes(user.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | I cannot **hack** and **ban** my owner.`)
                ]
            });
        }

        if (user.id === message.member.id) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | You cannot hackban yourself.`)
                ]
            });
        }

        // Attempt to ban the user by their ID
        try {
            await message.guild.members.ban(user, { reason: `${message.author.tag} | ${reason}` });

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.tick} | Successfully **Hacked** and **Banned** <@${user}> executed by: ${message.author.tag}\n${client.emoji.arrow} Reason: ${reason}`)
                ]
            });

        } catch (err) {
            console.error(err);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | I couldn't **Hackban** the user. Please check if I have the necessary permissions and role hierarchy.`)
                ]
            });
        }
    }
};
