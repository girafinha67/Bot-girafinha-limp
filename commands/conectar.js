const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const emojis = require('../DataBaseJson/emojis.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('conectar')
        .setDescription('Faz o bot entrar em um canal de voz específico.')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('O canal de voz que o bot deve entrar')
                .addChannelTypes(ChannelType.GuildVoice) // Filtra para mostrar apenas canais de voz
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels), // Apenas quem gerencia canais

    async execute(interaction) {
        const voiceChannel = interaction.options.getChannel('canal');

        await interaction.deferReply({ ephemeral: true });

        // 1. Verificações de permissão do Bot
        if (!voiceChannel.joinable) {
            return interaction.editReply({ 
                content: `${emojis.failuser_emoji || '❌'} Eu não tenho permissão para entrar no canal ${voiceChannel}!` 
            });
        }

        try {
            // 2. Conectar ao canal escolhido
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfMute: true,  // Fica mutado
                selfDeaf: true,  // Fica ensurdecido (economiza internet/processamento)
            });

            const embed = new EmbedBuilder()
                .setTitle(`${emojis.confirmed_emoji || '✅'} Bot Conectado!`)
                .setDescription(`Conectado com sucesso ao canal de voz: **${voiceChannel.name}**`)
                .addFields({ name: 'Status', value: '🔇 Mutado / Ensurdecido', inline: true })
                .setColor(0x5865F2)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Erro ao conectar no canal de voz:', error);
            await interaction.editReply({ 
                content: `${emojis.failuser_emoji || '❌'} Ocorreu um erro ao tentar entrar no canal de voz.` 
            });
        }
    }
};
