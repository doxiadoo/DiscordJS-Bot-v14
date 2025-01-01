const { EmbedBuilder } = require('discord.js');

// Bot owner's IDs
const OWNER_IDS = ['763141886834769980', '1217922797968424983'];

// Specific server and staff role IDs
const GUILD_ID = '720387763127451769';
const STAFF_ROLE_ID = '1259247122809753651';

// Emoji for staff members
const STAFF_EMOJI = '<:staff:1318720016832663633>'; // Change this to the desired emoji

module.exports = {
    name: 'staff',
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
                .setDescription(`Correct usage: \`${prefix}staff <add|remove|show> <user>\``);
            return message.channel.send({ embeds: [embed] });
        }

        const action = args[0].toLowerCase();
        const targetUser = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        const guild = client.guilds.cache.get(GUILD_ID);
        const staffRole = guild.roles.cache.get(STAFF_ROLE_ID);

        // Function to update and show the list of staff members
        const showUpdatedStaffList = () => {
            const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(STAFF_ROLE_ID));
            const staff = [];

            membersWithRole.forEach(member => {
                staff.push(`${STAFF_EMOJI} <@${member.user.id}>`);
            });

            const staffSection = staff.length > 0 ? `ㅤㅤㅤ\n${staff.join('\n')}` : 'No staff members found.';

            const embed = new EmbedBuilder()
                .setTitle(`lowest - Staff Members`)
                .setColor('#2f3136')
                .setDescription(`${staffSection}`)
                .setFooter({ text: 'Staff members have special badges on their profiles.' });

            return message.channel.send({ embeds: [embed] });
        };

        // Action: "add" staff role (Only for bot owners)
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
            if (targetUser.roles.cache.has(STAFF_ROLE_ID)) {
                const embed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setTitle('User Already Staff')
                    .setDescription(`${targetUser.user.tag} is already a staff member.`);
                return message.channel.send({ embeds: [embed] });
            }

            try {
                await targetUser.roles.add(staffRole);
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('Role Added')
                    .setDescription(`The staff role has been added to ${targetUser.user.tag}.`);
                await message.channel.send({ embeds: [embed] });

                // Show updated staff list
                return showUpdatedStaffList();
            } catch (error) {
                console.error(error);
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Error')
                    .setDescription('There was an error adding the role.');
                return message.channel.send({ embeds: [embed] });
            }
        }

        // Action: "remove" staff role (Only for bot owners)
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
            if (!targetUser.roles.cache.has(STAFF_ROLE_ID)) {
                const embed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setTitle('User Not Staff')
                    .setDescription(`${targetUser.user.tag} is not a staff member.`);
                return message.channel.send({ embeds: [embed] });
            }

            try {
                await targetUser.roles.remove(staffRole);
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('Role Removed')
                    .setDescription(`The staff role has been removed from ${targetUser.user.tag}.`);
                await message.channel.send({ embeds: [embed] });

                // Show updated staff list
                return showUpdatedStaffList();
            } catch (error) {
                console.error(error);
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Error')
                    .setDescription('There was an error removing the role.');
                return message.channel.send({ embeds: [embed] });
            }
        }

        // Action: "show" staff members (Available to everyone)
        if (action === 'show') {
            return showUpdatedStaffList();
        }
    }
};