const { EmbedBuilder } = require("discord.js");

function characterEmbedGenerator(characterInfo, isLoggedIn) {

    //Creating embed and adding title, url, thumbnail, and link
    const characterEmbed = new EmbedBuilder()
    .setTitle(characterInfo.name.userPreferred)
    .addFields(
        {name: "Gender", value: characterInfo.gender ? characterInfo.gender: "Other"}
    )
    .setThumbnail(characterInfo.image.large)
    .setURL(characterInfo.siteUrl)

    //Converting date of birth from separate numbers into a readable string, taking into account that any field may or may not be there
    let dateOfBirth = ""
    if (characterInfo.dateOfBirth.year) dateOfBirth += characterInfo.dateOfBirth.year
    if (characterInfo.dateOfBirth.month) dateOfBirth += characterInfo.dateOfBirth.month
    if (characterInfo.dateOfBirth.day) dateOfBirth += characterInfo.dateOfBirth.day
    
    //Checking to see if DOB or age exist. If so, add to embed
    if(dateOfBirth) characterEmbed.addFields({name: "Birthday", value: dateOfBirth, inline: true})
    if(characterInfo.age) characterEmbed.addFields({name: "Age", value: `${characterInfo.age}`, inline: true})

    //If the user is logged in, add the "Favorited" field
    if(isLoggedIn){
        characterEmbed.addFields({name: "Favorited", value: characterInfo.isFavourite ? "Yes" : "No"})
    }

    //Processing the description
    //Replacing Anilist markup with Discord markup
    //Anilist bold (__) to Discord bold (**)
    

    return characterEmbed
}

module.exports = {
    characterEmbedGenerator,
}