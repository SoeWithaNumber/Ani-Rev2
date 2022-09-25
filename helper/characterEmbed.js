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
    if (characterInfo.dateOfBirth.year) dateOfBirth += `${characterInfo.dateOfBirth.year}/`
    if (characterInfo.dateOfBirth.month) dateOfBirth += characterInfo.dateOfBirth.month
    if (characterInfo.dateOfBirth.day) dateOfBirth += `/${characterInfo.dateOfBirth.day}`
    
    //Checking to see if DOB or age exist. If so, add to embed
    if(dateOfBirth) characterEmbed.addFields({name: "Birthday", value: dateOfBirth, inline: true})
    if(characterInfo.age) characterEmbed.addFields({name: "Age", value: `${characterInfo.age}`, inline: true})

    //If the user is logged in, add the "Favorited" field
    if(isLoggedIn){
        characterEmbed.addFields({name: "Favorited", value: characterInfo.isFavourite ? "Yes" : "No"})
    }

    //Processing the description
    let description = characterInfo.description
    //Underscores in Anilist work the same as asterisks in Discord, so replace them one-for-one
    description = description.replaceAll("_","*")
    //Replace Anilist spoiler tags with Discord spoiler tags
    description = description.replaceAll(/~!|!~/g, "||")

    //If the description is too long, cut it to length, then remove tailing sentences, replace any uncompleted tags, then add a read more option
    if(description.length>4096){
        description = description.slice(0,4096-50)
        //Remove trailing sentences
        description = description.replace(/[^.]+$/, "")

        //If the number of tags is uneven, finish the one that got cut-off
        let tags = description.match(/\*+|\|\||~~/g)
        if (tags.length % 2 != 0) description += tags[tags.length-1]

        //Add read more button
        description += ` [Read more](${ characterInfo.siteUrl })`
    }
    characterEmbed.setDescription(description)
    return characterEmbed
}

module.exports = {
    characterEmbedGenerator,
}