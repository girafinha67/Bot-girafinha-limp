const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde com Pong!'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Calculando ping...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`Pong! 🏓\nLatência: ${latency}ms\nAPI Latência: ${Math.round(interaction.client.ws.ping)}ms`);
    },
}; 