const { ActivityType } = require('discord.js');

module.exports = async (client) => {
  client.on("ready", async () => {
    console.log(`${client.user.tag} Has Logged In!`);

    // Array de estados personalizados
    const statuses = [
      { name: `🔗 discord.gg/lowest`, type: ActivityType.Custom },
      { name: `m.help • Shard 1`, type: ActivityType.Custom },
      { name: `Made by LowestServices`, type: ActivityType.Custom }
      // { name: `text`, type: ActivityType.Custom },
    ];

    let currentIndex = 0;

    // Cambia de estado cada 10 segundos
    setInterval(() => {
      const status = statuses[currentIndex];
      client.user.setActivity(status.name, { type: status.type });

      currentIndex = (currentIndex + 1) % statuses.length;
    }, 10000);
  });
};