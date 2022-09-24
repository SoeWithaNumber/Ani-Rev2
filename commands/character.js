const {SlashCommandBuilder} = require("discord.js");
function execute(interaction) {
    console.log(interaction.options.getString("character"))
}

module.exports = {
    execute,
    data: new SlashCommandBuilder()
        .setName("character")
        .setDescription("Searches for a character")
        .addStringOption(option =>
            option.setName("character")
            .setDescription("The name of the character you want")
            .setRequired(true)
        ),
    name: "character"

}

