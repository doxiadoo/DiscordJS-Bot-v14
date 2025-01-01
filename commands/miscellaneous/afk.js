const { EmbedBuilder } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "afk",
  aliases: [],
  punitop: false,
  adminPermit: false,
  ownerPermit: false,
  cat: "miscellaneous",

  run: async (client, message, args, prefix) => {
    try {
      const reason = args.join(" ") || "AFK";
      const timestamp = `<t:${Math.floor(Date.now() / 1000)}:R>`;

      const member = message.member;

      // Check if the user is already marked as AFK
      if (member.afk) {
        member.afk = null;
        const embed = new EmbedBuilder()
          .setDescription(`> 👋 ${member.user} Welcome back! Your **AFK** status has been removed.`)
          .setColor("Green");
        await message.channel.send({ embeds: [embed] });

        try {
          await member.setNickname(member.user.username);
        } catch (err) {
          console.error("Error resetting nickname:", err);
        }

        return;
      }

      // Set user as AFK
      member.afk = { reason, timestamp };

      try {
        await member.setNickname(`AFK | ${member.displayName}`);
      } catch (err) {
        console.error("Error setting AFK nickname:", err);
      }

      const embed = new EmbedBuilder()
        .setDescription(`> 💤 ${member.user} is now AFK with the status: **${reason}**`)
        .setColor("Blue");
      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error("AFK Command Error:", error);
      const embed = new EmbedBuilder()
        .setDescription(`> ❌ An error occurred while processing your request.`)
        .setColor("Red");
      await message.channel.send({ embeds: [embed] });
    }
  },

  onMessage: async (client, message) => {
    try {
      if (message.author.afk) {
        try {
          await message.member.setNickname(message.member.user.username);
        } catch (err) {
          console.error("Error resetting nickname on message:", err);
        }

        message.author.afk = null;

        const embed = new EmbedBuilder()
          .setDescription(`> 👋 ${message.author} Welcome back! Your **AFK** status has been removed.`)
          .setColor("Green");
        await message.channel.send({ embeds: [embed] });
      }

      for (const word of message.content.split(" ")) {
        const mentionedMember = client.users.cache.get(word.replace(/<@|>/g, ""));
        if (mentionedMember && mentionedMember.afk) {
          const embed = new EmbedBuilder()
            .setDescription(`> 💤 ${mentionedMember} is AFK: **${mentionedMember.afk.reason}**, since ${mentionedMember.afk.timestamp}`)
            .setColor("Blue");
          await message.channel.send({ embeds: [embed] });
          break;
        }
      }
    } catch (error) {
      console.error("Error handling AFK message:", error);
    }
  },
};
