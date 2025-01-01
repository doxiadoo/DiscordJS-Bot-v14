const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('broadcast')
    .setDescription('Envía un mensaje a todos los servidores donde está el bot.')
    .addStringOption(option =>
      option
        .setName('mensaje')
        .setDescription('El mensaje que se enviará a todos los servidores.')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Verificar permisos
    if (!interaction.user.id === '763141886834769980') {
      return interaction.reply({ content: 'No tienes permiso para usar este comando.', ephemeral: true });
    }

    const mensaje = interaction.options.getString('mensaje');
    const client = interaction.client;

    // Responder al usuario que el proceso está en curso
    await interaction.reply('Enviando mensaje a todos los servidores...');

    let enviados = 0;
    let errores = 0;

    for (const guild of client.guilds.cache.values()) {
      try {
        // Obtener el primer canal visible donde el bot tiene permisos para enviar mensajes
        const canal = guild.channels.cache.find(
          ch =>
            ch.isTextBased() &&
            ch.permissionsFor(guild.members.me).has('SendMessages')
        );

        if (canal) {
          await canal.send(mensaje);
          enviados++;
        } else {
          console.log(`No se encontró un canal válido en el servidor: ${guild.name} (${guild.id})`);
          errores++;
        }
      } catch (error) {
        console.error(`Error enviando mensaje en el servidor: ${guild.name} (${guild.id})`, error);
        errores++;
      }
    }

    // Responder al usuario con el resultado
    await interaction.followUp(
      `Se envió el mensaje a ${enviados} servidores. Hubo errores en ${errores} servidores.`
    );
  },
};
