const {SlashCommandBuilder} = require("discord.js");
const {characterEmbedGenerator} = require("../helper/characterEmbed.js")
async function execute(interaction) {
    let characterName = interaction.options.getString("character")
    let request = {
        data:JSON.stringify({
            query: `
            query($name: String!){
                Character(search: $name) {
                    name {
                        userPreferred
                    }
                gender
                age
                image {
                    large
                }
                dateOfBirth {
                    year
                    month
                    day
                }
                siteUrl
                description(asHtml: false)
                isFavourite
                }
            }
            `,
            variables:{
                name: characterName
            }
        })
    }

    let aniUsers = interaction.client.anilistUsers
    
    if (aniUsers.has(interaction.user.id)) request.headers = { "Authorization": `Bearer ${aniUsers.get(interaction.user.id)}`}
    let characterInfo = await interaction.client.axios.request(request).catch(console.log)

    let characterEmbed = characterEmbedGenerator(characterInfo.Character, aniUsers.has(interaction.user.id))
    interaction.reply({embeds:[characterEmbed]})

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

