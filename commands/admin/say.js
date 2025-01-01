const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'say',
    ownerPermit: false,
    adminPermit: true,
    punitop: false,
    cat: 'admin',
    run: async (client, message, args) => {
        // Verificar que el usuario tiene permisos para usar el comando
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("You don't have permission to use this command.");
        }

        // Verificar que hay texto después del comando
        const text = args.join(" ");
        if (!text) {
            return message.reply("Please provide the message you want the bot to say.");
        }

        try {
            // Eliminar el mensaje del usuario
            await message.delete();

            // Enviar el mensaje del usuario
            await message.channel.send(text);
        } catch (error) {
            console.error(error);
            return message.reply("There was an error trying to execute this command.");
        }
    },
};