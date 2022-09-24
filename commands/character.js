const {SlashCommandBuilder} = require("discord.js");
function execute(interaction) {
    console.log("Character Command")
}

module.exports = {
    execute,
    data: new SlashCommandBuilder()
        .setName("character")
        .setDescription("Searches for a character"),
    name: "character"

}

