// Example of how to make a Command

module.exports = {
    name: "ping",
    aliases: ["pong", "latency"],
    category: "Utility",
    description: "Check the bot's ping!",
    adminOnly: false,
    ownerOnly: false,
    doNotRegisterSlash: false,
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging...`);

        const pingEmbed = new client.g.discord.MessageEmbed()
            .setTitle(':signal_strength: Bot Ping')
            .addField("Time", `${Math.floor(msg.createdAt - message.createdAt)}ms`, true)
            .addField("API Ping", `${client.ws.ping}ms`, true)
            .setColor(client.g.config.embedColor)
            .setFooter({ text: `${client.g.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

        await message.reply({ embeds: [pingEmbed], allowedMentions: { repliedUser: false } });

        msg.delete();
    },
};
