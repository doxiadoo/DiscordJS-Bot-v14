const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    name: 'report',
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'general',
    run: async (client, message, args, prefix) => {
        // Check if the user has provided a message
        const reportContent = args.join(' ');
        if (!reportContent) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#008080') // Dark turquoise color
                .setDescription(`<@${message.author.id}>: Provide the message to report.`);

            return message.reply({ embeds: [errorEmbed] });
        }

        // Optional image link from the last argument (if it looks like a URL)
        const imageUrl = args[args.length - 1].match(/^https?:\/\/\S+\.\S+$/) ? args.pop() : null;

        // Define the support server and channel IDs
        const supportServerId = '720387763127451769'; // Change this to your support server ID
        const supportChannelId = '1314610075922337812'; // Change this to your support channel ID

        try {
            // Fetch the support channel
            const supportChannel = await client.channels.fetch(supportChannelId);

            if (!supportChannel || supportChannel.type !== ChannelType.GuildText || supportChannel.guild.id !== supportServerId) {
                const channelNotFoundEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Error')
                    .setDescription('The support channel cannot be found or is not a valid text channel.')
                    .setTimestamp();

                return message.reply({ embeds: [channelNotFoundEmbed] });
            }

            // Create the report embed
            const reportEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('New Report')
                .setDescription(reportContent)
                .addFields(
                    { name: 'Reported by', value: message.author.tag, inline: true },
                    { name: 'Reporter ID', value: message.author.id, inline: true },
                    { name: 'Origin Server', value: message.guild.name, inline: true },
                    { name: 'Server ID', value: message.guild.id, inline: true }
                )
                .setTimestamp();

            // Validate and add image if the link is valid
            if (imageUrl) {
                reportEmbed.setImage(imageUrl);
            }

            // Send the report to the support channel
            await supportChannel.send({ embeds: [reportEmbed] });

            const confirmationEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Report Sent')
                .setDescription('Your report has been sent to the support channel.')
                .setTimestamp();

            await message.reply({ embeds: [confirmationEmbed] });
        } catch (error) {
            console.error("Error fetching the support channel:", error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('There was an error trying to send the report. Please try again later.')
                .setTimestamp();

            await message.reply({ embeds: [errorEmbed] });
        }
    }
};
