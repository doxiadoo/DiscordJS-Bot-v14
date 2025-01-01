const { EmbedBuilder } = require('discord.js');

// Bot owner's IDs
const OWNER_IDS = ['763141886834769980', '1217922797968424983'];

// Specific server and donor role ID
const GUILD_ID = '720387763127451769'; // Cambia esto al ID de tu servidor
const DONOR_ROLE_ID = '1314610025112666123'; // Cambia esto al ID del rol de donador

// Emoji para el badge de donador
const DONOR_BADGE_EMOJI = '<:donator:1318720002102132828>'; // Cambia esto por el emoji que prefieras

module.exports = {
    name: 'premium',
    punitop: true,
    adminPermit: false,
    ownerPermit: false,
    cat: 'punit',
    run: async (client, message, args, prefix) => {
        // Validate the command usage
        if (!args[0] || !['add', 'remove', 'show'].includes(args[0].toLowerCase())) {
            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setTitle('Invalid Usage')
                .setDescription(`Correct usage: \`${prefix}premium <add|remove|show> <user>\``);
            return message.channel.send({ embeds: [embed] });
        }

        const action = args[0].toLowerCase();
        const targetUser = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        const guild = client.guilds.cache.get(GUILD_ID);
        const donorRole = guild.roles.cache.get(DONOR_ROLE_ID);

        // Function to update and show the list of donor members
        const showUpdatedDonorList = () => {
            const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(DONOR_ROLE_ID));
            const donors = [];

            membersWithRole.forEach(member => {
                donors.push(`${DONOR_BADGE_EMOJI} <@${member.user.id}>`); // Agregar badge junto al usuario
            });

            const donorSection = donors.length > 0 ? `ㅤㅤㅤ\n${donors.join('\n')}` : 'No premium members found.';

            const embed = new EmbedBuilder()
                .setTitle(`Premium Members`)
                .setColor('#2f3136')
                .setDescription(`${donorSection}`)
                .setFooter({ text: 'Premium members have special badges on their profiles.' });

            return message.channel.send({ embeds: [embed] });
        };

        // Action: "add" donor role (Only for bot owners)
        if (action === 'add') {
            if (!OWNER_IDS.includes(message.author.id)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Permission Denied')
                    .setDescription("You don't have permission to use this command.");
                return message.channel.send({ embeds: [embed] });
            }

            if (!targetUser) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Error')
                    .setDescription('Please mention a valid user.');
                return message.channel.send({ embeds: [embed] });
            }
            if (targetUser.roles.cache.has(DONOR_ROLE_ID)) {
                const embed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setTitle('User Already Premium')
                    .setDescription(`${targetUser.user.tag} is already a premium member.`);
                return message.channel.send({ embeds: [embed] });
            }

            try {
                await targetUser.roles.add(donorRole);
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('Role Added')
                    .setDescription(`The donor role has been added to ${targetUser.user.tag}.`);
                await message.channel.send({ embeds: [embed] });

                // Show updated donor list
                return showUpdatedDonorList();
            } catch (error) {
                console.error(error);
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Error')
                    .setDescription('There was an error adding the role.');
                return message.channel.send({ embeds: [embed] });
            }
        }

        // Action: "remove" donor role (Only for bot owners)
        if (action === 'remove') {
            if (!OWNER_IDS.includes(message.author.id)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Permission Denied')
                    .setDescription("You don't have permission to use this command.");
                return message.channel.send({ embeds: [embed] });
            }

            if (!targetUser) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Error')
                    .setDescription('Please mention a valid user.');
                return message.channel.send({ embeds: [embed] });
            }
            if (!targetUser.roles.cache.has(DONOR_ROLE_ID)) {
                const embed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setTitle('User Not Donor')
                    .setDescription(`${targetUser.user.tag} is not a donor member.`);
                return message.channel.send({ embeds: [embed] });
            }

            try {
                await targetUser.roles.remove(donorRole);
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('Role Removed')
                    .setDescription(`The donor role has been removed from ${targetUser.user.tag}.`);
                await message.channel.send({ embeds: [embed] });

                // Show updated donor list
                return showUpdatedDonorList();
            } catch (error) {
                console.error(error);
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Error')
                    .setDescription('There was an error removing the role.');
                return message.channel.send({ embeds: [embed] });
            }
        }

        // Action: "show" donor members (Available to everyone)
        if (action === 'show') {
            return showUpdatedDonorList();
        }
    }
};