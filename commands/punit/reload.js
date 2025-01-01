const { EmbedBuilder } = require("discord.js");
const fs = require('fs');
const path = require('path');

// Replace with the bot owner's ID
const OWNER_IDS = ['763141886834769980', '1217922797968424983'];

module.exports = {
    name: 'reload',
    aliases: ['r'],
    punitop: true,
    adminPermit: false,
    ownerPermit: false,
    cat: 'punit',
    run: async (client, message, args, prefix) => {
        if (message.author.id !== OWNER_ID) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<:deny:1312884018160599181> You do not have permission to run this command.`)
                ]
            });
        }

        try {
            const commandsDir = path.resolve(__dirname, '../'); // Cambia '../' según la ubicación del archivo reload.js
            const commandFiles = [];
            let totalCommands = 0;

            // Recorrer subdirectorios para obtener archivos .js
            const getCommandFiles = (dir) => {
                const files = fs.readdirSync(dir, { withFileTypes: true });
                for (const file of files) {
                    const filePath = path.join(dir, file.name);
                    if (file.isDirectory()) {
                        getCommandFiles(filePath);
                    } else if (file.isFile() && file.name.endsWith('.js')) {
                        commandFiles.push(filePath);
                    }
                }
            };

            getCommandFiles(commandsDir);

            // Recargar cada archivo de comando
            for (const filePath of commandFiles) {
                const commandName = path.basename(filePath, '.js');
                delete require.cache[require.resolve(filePath)];
                const updatedCommand = require(filePath);

                // Validar si el comando tiene un nombre válido
                if (updatedCommand.name) {
                    client.commands.set(updatedCommand.name, updatedCommand);
                    totalCommands++;
                } else {
                    console.warn(`El archivo ${filePath} no tiene un nombre válido y fue omitido.`);
                }
            }

            // Crear embed de éxito
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(`> <:approve:1312884005359714456> ${message.author.toString()} has reloaded **${totalCommands}** commands.`);

            return message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(`Error al recargar comandos:`, error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(`<:warning:1312884332859494400> An error occurred while reloading commands:\n\`${error.message}\``);

            return message.channel.send({ embeds: [errorEmbed] });
        }
    }
};
