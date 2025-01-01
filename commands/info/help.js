const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  name: `help`,
  aliases: ['h'],
  punitop: false,
  adminPermit: false,
  ownerPermit: false,
  cat: 'info',
  run: async (client, message, args, prefix) => {
    const ownerIds = ['763141886834769980', '1217922797968424983']; // Owner IDs

    let em = new EmbedBuilder()
      .setColor(`#2f3136`)
      .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
      .setDescription(
        `> Use the select menu below to navigate throughout the help menu.

**Protection**
If you use this bot for anti-raid you must have the bot role the highest in the hierarchy and you have to give me **Administrator Permissions**, you can use **</report:1295132571713277957>** to send any errors or questions to the **[support server](https://discord.gg/Gak6Yb5t39)**.

**[TOS](https://github.com/doxiadoo/lowest/blob/main/TERMS_OF_SERVICE.md) • [Privacy](https://github.com/doxiadoo/lowest/blob/main/PRIVACY_POLICY.md)**`
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    let r1 = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('he')
        .setPlaceholder('Menu')
        .addOptions([
          {
            label: 'Home',
            value: 'h1',
            emoji: '<:home:1320073393931943946>',
          },
          {
            label: 'Admin',
            value: 'h3',
            emoji: '<:admin:1320073555081170944>',
          },
          {
            label: 'Moderation',
            value: 'h2',
            emoji: '<:mod:1320073407534202901>',
          },
          {
            label: 'Information',
            value: 'h5',
            emoji: '<:info2:1320073427356356608>',
          },
          {
            label: 'Config',
            value: 'h9', // New category "Config"
            emoji: '<:config:1320073442568962150>', // Puedes usar un emoji apropiado
          },
          {
            label: 'Miscellaneous',
            value: 'h10', // New category "Miscellaneous"
            emoji: '<:misc:1320073461204521117>',
          },
          {
            label: 'Roleplay',
            value: 'h11', // New category "Roleplay"
            emoji: '<:rolplay:1320073476320661504>',
          },
          {
            label: 'LastFM',
            value: 'h8',
            emoji: '<:fm:1320073514631561236>',
          },
          {
            label: 'Fun',
            value: 'h12', // New category "Fun"
            emoji: '<:fun:1320073489075404912>',
          },
          {
            label: 'Social',
            value: 'h13', // New category "Social"
            emoji: '<:social:1320073502128341012>',
          },
          {
            label: 'Premium',
            value: 'h6',
            emoji: '<:premium:1320073526794780682>',
          },
          ...(ownerIds.includes(message.author.id) ? [{
            label: 'Owner',
            value: 'h7',
            emoji: '<:owner:1320073541735157841>',
          }] : []), // Only add this option if the user is an owner
        ])
    );

    let msg = await message.reply({ embeds: [em], components: [r1] });
    let page = 0;

    // Function to check if there are commands in a category and format them as ` ```bf comando1, comando2 ``` `
    const getCommandsByCategory = (category) => {
      const commands = client.commands.filter(x => x.cat === category);
      return commands.size > 0
        ? `\`\`\`${commands.map(x => x.name).sort().join(', ')}\`\`\``
        : 'No commands available in this category.';
    };

    let embed1 = new EmbedBuilder()
      .setColor(`#2f3136`)
      .addFields({ name: 'Moderation Commands', value: getCommandsByCategory('moderation') })
      .setAuthor({ name: `lowest  ☆`, iconURL: client.user.displayAvatarURL() });

    let embed2 = new EmbedBuilder()
      .setColor(`#2f3136`)
      .addFields({ name: 'Admin Commands', value: getCommandsByCategory('admin') })
      .setAuthor({ name: `lowest  ☆`, iconURL: client.user.displayAvatarURL() });

    let embed3 = new EmbedBuilder()
      .setColor(`#2f3136`)
      .addFields({ name: 'Information Commands', value: getCommandsByCategory('info') })
      .setAuthor({ name: `lowest  ☆`, iconURL: client.user.displayAvatarURL() });

    let embed5 = new EmbedBuilder()
      .setColor(`#2f3136`)
      .addFields({ name: 'Premium Commands', value: getCommandsByCategory('premium') })
      .setAuthor({ name: `lowest  ☆`, iconURL: client.user.displayAvatarURL() });

    let embed6 = new EmbedBuilder()
      .setColor(`#2f3136`)
      .addFields({ name: 'Owner Commands', value: getCommandsByCategory('punit') })
      .setAuthor({ name: `lowest  ☆`, iconURL: client.user.displayAvatarURL() });

    let embed8 = new EmbedBuilder()
      .setColor(`#2f3136`)
      .addFields({ name: 'LastFM Commands', value: getCommandsByCategory('lastfm') })
      .setAuthor({ name: `lowest  ☆`, iconURL: client.user.displayAvatarURL() });

    let embed9 = new EmbedBuilder()
      .setColor(`#2f3136`)
      .addFields({ name: 'Config Commands', value: getCommandsByCategory('config') })
      .setAuthor({ name: `lowest  ☆`, iconURL: client.user.displayAvatarURL() });

    // Nuevos embeds para las categorías "Miscellaneous", "Roleplay", "Fun", "Social"
    let embed10 = new EmbedBuilder()
      .setColor(`#2f3136`)
      .addFields({ name: 'Miscellaneous Commands', value: getCommandsByCategory('miscellaneous') })
      .setAuthor({ name: `lowest  ☆`, iconURL: client.user.displayAvatarURL() });

    let embed11 = new EmbedBuilder()
      .setColor(`#2f3136`)
      .addFields({ name: 'Roleplay Commands', value: getCommandsByCategory('roleplay') })
      .setAuthor({ name: `lowest  ☆`, iconURL: client.user.displayAvatarURL() });

    let embed12 = new EmbedBuilder()
      .setColor(`#2f3136`)
      .addFields({ name: 'Fun Commands', value: getCommandsByCategory('fun') })
      .setAuthor({ name: `lowest  ☆`, iconURL: client.user.displayAvatarURL() });

    let embed13 = new EmbedBuilder()
      .setColor(`#2f3136`)
      .addFields({ name: 'Social Commands', value: getCommandsByCategory('social') })
      .setAuthor({ name: `lowest  ☆`, iconURL: client.user.displayAvatarURL() });

    var embeds = [embed1, embed2, embed3, embed5, embed6, embed8, embed9, embed10, embed11, embed12, embed13]; // Agregar los nuevos embeds

    const collector = await msg.createMessageComponentCollector({
      filter: (interaction) => {
        if (message.author.id === interaction.user.id) return true;
        else {
          interaction.reply({ content: `${client.emoji.cross} | This is not your session, run \`${prefix}help\` to create yours.`, ephemeral: true });
        }
      },
      time: 100000,
      idle: 100000 / 2
    });

    collector.on('collect', async (interaction) => {
      if (interaction.isStringSelectMenu()) {
        for (const value of interaction.values) {
          if (value === 'h1') {
            let em = new EmbedBuilder().setColor(`#2f3136`).setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL() }).setDescription(
              `> Use the select menu below to navigate throughout the help menu.

**Protection**
If you use this bot for anti-raid you must have the bot role the highest in the hierarchy and you have to give me **Administrator Permissions**, you can use **</report:1295132571713277957>** to send any errors or questions to the **[support server](https://discord.gg/Gak6Yb5t39)**.

**[TOS](https://github.com/doxiadoo/lowest/blob/main/TERMS_OF_SERVICE.md) • [Privacy](https://github.com/doxiadoo/lowest/blob/main/PRIVACY_POLICY.md)**`
            ).setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
            return interaction.update({ embeds: [em] });
          }
          if (value === 'h2') {
            return interaction.update({ embeds: [embed1] });
          }
          if (value === 'h3') {
            return interaction.update({ embeds: [embed2] });
          }
          if (value === 'h5') {
            return interaction.update({ embeds: [embed3] });
          }
          if (value === 'h6') {
            return interaction.update({ embeds: [embed5] });
          }
          if (value === 'h7' && ownerIds.includes(interaction.user.id)) { // Only owners can access
            return interaction.update({ embeds: [embed6] });
          }
          if (value === 'h8') {
            return interaction.update({ embeds: [embed8] });
          }
          if (value === 'h9') {
            return interaction.update({ embeds: [embed9] });
          }
          if (value === 'h10') {
            return interaction.update({ embeds: [embed10] });
          }
          if (value === 'h11') {
            return interaction.update({ embeds: [embed11] });
          }
          if (value === 'h12') {
            return interaction.update({ embeds: [embed12] });
          }
          if (value === 'h13') {
            return interaction.update({ embeds: [embed13] });
          }
        }
      }
    });
  }
};
