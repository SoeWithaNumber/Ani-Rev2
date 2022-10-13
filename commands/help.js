const {EmbedBuilder,SlashCommandBuilder} = require("discord.js");

function execute(interaction){
    const helpEmbed = new EmbedBuilder()
    .setTitle("Welcome to Ani!")
    .setColor("Blue")
    .setDescription("[Found a bug?](https://www.definitions.net/definition/TODO)")
    .setFooter({ text:"Version 0.6.0-dev"})
    
    interaction.client.commands.forEach(value=>{
        helpEmbed.addFields({name: `\`/${value.name}\``, value: `${value.description}`})
    
    })
    interaction.reply({embeds:[helpEmbed]})

}

module.exports = {
    execute,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Ani-bot Help Command"),
    name:"help",
    description: "This command."
        
}

