const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, '..'); // volta pra raiz
const foldersPath = path.join(commandsPath, 'commands');

// pega todos arquivos da pasta commands
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    if (command.data && command.data.toJSON) {
        commands.push(command.data.toJSON());
    }
}

// pega do .env
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('🔄 Atualizando comandos...');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('✅ Comandos atualizados!');
    } catch (error) {
        console.error(error);
    }
})();
