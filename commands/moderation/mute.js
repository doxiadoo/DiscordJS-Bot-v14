const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: 'mute',
    aliases: ['timeout', 'stfu', 'm'],
    adminPermit: true,
    ownerPermit: false,
    cat: 'moderation',
    punitop: false,
    run: async (client, message, args, prefix) => {
        // Check if the command has the necessary arguments
        if (!args[0]) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} Command Usage: \`${prefix}mute <user> <time> [reason]\``)
                ]
            });
        }

        // Get the mentioned user or fetch from cache
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} Please provide a valid user.`)
                ]
            });
        }

        let reason = args.slice(2).join(' ') || 'No Reason given';
        let time = args[1] || '7d'; // Default to 7 days if no time is provided
        let dur = ms(time);

        // Validate duration
        if (!dur) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} Please provide a valid time.`)
                ]
            });
        }

        // Check if the user is already muted
        if (user.isCommunicationDisabled()) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} I can't mute that user. They are already muted.`)
                ]
            });
        }

        // Check for admin permissions
        if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.warning} I can't mute admins.`)
                ]
            });
        }

        // Prevent muting self, the bot, and specific users
        if (user.id === client.user.id) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.cross} Hey, I know you are dumb; why are you proving it?`)
                ]
            });
        }

        if (user.id === message.guild.ownerId) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> <:warning:1312884332859494400> You can't mute the Server Owner.`)
                ]
            });
        }

        if (client.config.owner.includes(user.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> <:warning:1312884332859494400> I can't mute my owner.`)
                ]
            });
        }

        if (user.id === message.member.id) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.cross} You cannot **Mute** yourself.`)
                ]
            });
        }

        if (!user.manageable) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> <:warning:1312884332859494400> I can't mute that user. Please check my role position and permissions.`)
                ]
            });
        }

        // Mute the user
        try {
            await user.timeout(dur, `${message.author.tag} | ${reason}`);

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> ${client.emoji.tick} Successfully **Muted** ${user.user.tag}, executed by: ${message.author.tag}\n${client.emoji.arrow} Reason: ${reason}`)
                ]
            });
        } catch (error) {
            console.error(error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`> <:warning:1312884332859494400> I couldn't mute that user. Please check my role position and permissions.`)
                ]
            });
        }
    }
};
