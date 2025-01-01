const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'prefix',
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'admin',
    run: async (client, message, args) => {
        // Check for Manage Guild permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross}  You require \`MANAGE_GUILD\` permissions to change the guild prefix.`)
                ],
                ephemeral: true
            });
        }

        // If no arguments are provided, show the help embed
        if (!args[0]) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setTitle('Prefix Command')
                    .setDescription('This command can set a guild custom prefix. ```\nSyntax: ,prefix <action> <prefix>\nExample: ,prefix set !\nExample: ,prefix reset```')
                    .setColor('#2f3136')
                ]
            });
        }

        // Handle "set" option
        if (args[0].toLowerCase() === 'set') {
            if (!args[1]) {
                return message.channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`${client.emoji.cross}  You must provide a prefix to set.`)
                    ],
                    ephemeral: true
                });
            }

            // Check prefix length
            if (args[1].length > 3) {
                return message.channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`${client.emoji.cross}  You cannot set more than three characters as a prefix.`)
                    ],
                    ephemeral: true
                });
            }

            // Check if a second argument is provided
            if (args[2]) {
                return message.channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`${client.emoji.cross}  You cannot set a second argument as a prefix.`)
                    ],
                    ephemeral: true
                });
            }

            // Set the new prefix
            client.data.set(`prefix_${message.guild.id}`, args[1]);
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.tick}  Guild prefix has been set to - \`${args[1]}\``)
                ]
            });
        }

        // Handle "reset" option
        if (args[0].toLowerCase() === 'reset') {
            client.data.delete(`prefix_${message.guild.id}`);
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.tick}  Successfully reset the guild prefix to - \`${client.config.prefix}\``)
                ]
            });
        }

        // Invalid action handling
        return message.channel.send({
            embeds: [new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`${client.emoji.cross}  Invalid action. Use \`,prefix\` for help.`)
            ]
        });
    }
};
