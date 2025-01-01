const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { modalSubmit } = require('../slashCommands/report'); // Asegúrate de usar la ruta correcta

module.exports = async (client) => {
    client.on("interactionCreate", async interaction => {
        if (interaction.isButton()) {
            if (interaction.customId === `ini_setup`) {
                if (interaction.member.id !== interaction.guild.ownerId && !client.config.owner.includes(interaction.member.id)) {
                    return interaction.reply({
                        embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You are not authorized to take this action...`)],
                        ephemeral: true
                    });
                } else {
                    var ans;
                    let data = await client.data2.get(`setup_${interaction.guild.id}`);
                    if (!data) await client.data2.set(`setup_${interaction.guild.id}`, `none`);
                    if (data === `beast`) { ans = `Beast Mode`; }
                    if (data === `secure`) { ans = `Secure Mode`; }
                    if (data === `none`) { ans = `None`; }
                    let em = new EmbedBuilder().setColor(`#2f3136`).setDescription(
                        `**Current setup mode is set to - \`${ans}\`**

                        ${client.emoji.dot} __**Secure Mode**__ ?
                        Secure Mode is the safer mode to secure your server using **Quarantine System**
                        1. It operates the offender by **Quarantining**.
                        2. It doesn't remove the offender from the server.
                        
                        ${client.emoji.dot} __**Beast Mode**__ ?
                        Beast Mode is a powerful mode to secure your server using **Discord Powers**
                        1. It operates the offender by **Banning**.
                        2. It bans the offender using Discord Powers.`
                    ).setFooter({ text: `It is recommended to use our Beast Mode.` }).setAuthor({
                        name: `| ${client.user.username.toUpperCase()} SETUP`,
                        iconURL: interaction.guild.iconURL({ dynamic: true })
                    });
                    let ok = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel(`Secure Mode`).setCustomId(`secure`),
                        new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel(`Beast Mode`).setCustomId(`beast`),
                        new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel(`None`).setCustomId(`no`)
                    );
                    return interaction.update({ embeds: [em], components: [ok] });
                }
            }

            if (interaction.customId === `no`) {
                if (interaction.member.id !== interaction.guild.ownerId && !client.config.owner.includes(interaction.member.id)) {
                    return interaction.reply({
                        embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You are not authorized to take this action...`)],
                        ephemeral: true
                    });
                }
                let d = await client.data2.get(`setup_${interaction.guild.id}`);
                if (!d) await client.data2.set(`setup_${interaction.guild.id}`, `none`);
                if (d === `none`) {
                    return interaction.reply({
                        embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | Security Mode is already set to - **\`NONE\`**`)],
                        ephemeral: true
                    });
                } else {
                    await client.data2.set(`setup_${interaction.guild.id}`, `none`);
                    return interaction.update({
                        embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(
                            `**${client.emoji.disabled} Anti Ban
                            ${client.emoji.disabled} Anti Kick
                            ${client.emoji.disabled} Anti Role-Create
                            ${client.emoji.disabled} Anti Role-Delete
                            ${client.emoji.disabled} Anti Role-Update
                            ${client.emoji.disabled} Anti Everyone
                            ${client.emoji.disabled} Anti Webhook
                            ${client.emoji.disabled} Anti Channel-Create
                            ${client.emoji.disabled} Anti Channel-Delete
                            ${client.emoji.disabled} Anti Channel-Update
                            ${client.emoji.disabled} Anti Bot
                            ${client.emoji.disabled} Anti Server-Update
                            ${client.emoji.disabled} Anti Prune**`
                        ).setFooter({ text: `SECURITY MODE: NONE`, iconURL: interaction.guild.iconURL({ dynamic: true }) })],
                        components: []
                    });
                }
            }

            // Aquí manejar la lógica para los modos de seguridad
            if (interaction.customId === `secure`) {
                // Handle secure mode setup logic
            }

            if (interaction.customId === `beast`) {
                // Handle beast mode setup logic
            }

            if (interaction.customId === `cmd_delete`) {
                if (!client.config.owner.includes(interaction.member.id)) {
                    return interaction.reply({
                        embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You are not authorized to take this action..`)],
                        ephemeral: true
                    });
                } else {
                    interaction.message.delete().catch(() => {});
                }
            }
        }

        // Manejar la interacción de envío del modal
        if (interaction.isModalSubmit()) {
            await modalSubmit(client, interaction); // Llama a la función para manejar el envío del modal
        }
    });
};

