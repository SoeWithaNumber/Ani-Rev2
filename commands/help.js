const {EmbedBuilder,SlashCommandBuilder} = require("discord.js");
function execute(interaction){
    console.log("did make here")
    const helpEmbed = new EmbedBuilder()
    .setTitle("Welcome to Ani!")
    .setColor("Blue")
    .setDescription("WIP")
    .setFooter({text:"Version 0.1.1-dev"})
    interaction.reply({embeds:[helpEmbed]})
}

module.exports = {
    execute,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Ani-bot Help Command"),
    name:"help"
        
}

