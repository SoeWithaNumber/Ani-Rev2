const {ModalBuilder, TextInputBuilder, SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
async function execute(interaction) {

    //Checking to see if the user is already logged in
    if(interaction.client.anilistUsers.get(interaction.user.id)){
        interaction.reply("You're already logged in!")
        return
    }

    //Creating the instructions embed
    const instructionEmbed = new EmbedBuilder()
    .setTitle("Welcome to Ani!")
    .setDescription("In order to access some features of this bot, you must [log in](https://anilist.co/api/v2/oauth/authorize?client_id=6856&response_type=code) to Anilist.")
    .addFields(
        { name: "Step 1", value: "Click the [login link](https://anilist.co/api/v2/oauth/authorize?client_id=6856&response_type=code)"},
        { name: "Step 2", value: "Log in to Anilist and copy the big string of text"},
        { name: "Step 3", value: "Once you copy the text, click the button"},
        { name: "Step 4", value: "Paste it in and have fun using Ani!"}
    )
    .setColor("#51c971")

    //Creating modal
    const loginModal = new ModalBuilder().setTitle("Login to Anilist!").setCustomId("loginModal")

    const tokenInput = new TextInputBuilder()
        .setLabel("Paste token")
        .setStyle("Paragraph")
        .setCustomId("tokenInput")
        .setPlaceholder("The big wall of text goes here!")

    const row = new ActionRowBuilder().addComponents(tokenInput)

    loginModal.addComponents(row)


    //Creating button for the embed
    const continueButton = new ButtonBuilder()
    .setCustomId("continueLogin")
    .setLabel("Continue")
    .setStyle(ButtonStyle.Primary)

    const buttonRow = new ActionRowBuilder()
    .addComponents(continueButton)

    //Sending embed with button
    let instructionMessage = await interaction.reply({embeds:[instructionEmbed], components: [buttonRow]})
    
    //Collecting the button input and showing modal
    const continueButtonCollector = instructionMessage.createMessageComponentCollector({filter: (interaction)=>interaction.customId=="continueLogin", time:180_000})
    
    continueButtonCollector.on("collect", buttonInteraction =>{
        buttonInteraction.showModal(loginModal)
    })

    //Disable button after finishing collector
    continueButtonCollector.on("end", ()=>{
        buttonRow.components[0].setDisabled(true)
        instructionMessage.interaction.editReply({components:[buttonRow]})
    })
    
    //Taking in the modal input
    let tokenSubmission = await interaction.awaitModalSubmit({filter: submission => submission.customId=="loginModal", time: 180_000})
    tokenSubmission.deferReply()
    let token = tokenSubmission.fields.getTextInputValue("tokenInput")

    //Disable submit button after taking form input
    buttonRow.components[0].setDisabled(true)
    instructionMessage.interaction.editReply({ components: [buttonRow] })
    
    //Request oauth token from anilist
    let authFailed = false
    let response = await interaction.client.axios.request({
        'url': 'https://anilist.co/api/v2/oauth/token',
        data:{
            'grant_type': 'authorization_code',
            'client_id': 6856,
            'client_secret': process.env.ANILIST_SECRET,
            'redirect_uri': 'https://anilist.co/api/v2/oauth/pin',
            'code': token
        }
    }).catch((error)=>{ //Error handling
        authFailed = true
        if(error.response.status == 400){

            tokenSubmission.editReply("Unable to authorize. Make sure you copied the token correctly!")
        }
        else{
            tokenSubmission.editReply("Unknown error occurred! Try again later")
        }
    })
    
    //If errored, return
    if(authFailed) return

    //Adding the user to the list of logged in users
    interaction.client.anilistUsers.set(interaction.user.id, response.data.access_token)

    //Grabbing current user info from Anilist
    let graphQLReq = `
        query{
            Viewer{
                name
                avatar{
                    large
                }
                about
                siteUrl
                statistics{
                    anime{
                        count
                    }
                    manga{
                        count
                    }
                }
            }
        }
    `
    let userInfo = await interaction.client.axios.request({
        headers: {
            Authorization: `Bearer ${interaction.client.anilistUsers.get(interaction.user.id)}`
        },
        data:
            JSON.stringify({query:graphQLReq})
    }).catch(()=>{ //More error handling
        tokenSubmission.editReply("An unknown error has ocurred! Try again later")
        authFailed = true
    })

    if(authFailed) return

    //TO BE REPLACED WITH USER EMBED FUNCTION FROM LIAM

    const userEmbed = new EmbedBuilder()
    .setTitle(`Logged in as ${userInfo.Viewer.name}`)
    .setThumbnail(userInfo.Viewer.avatar.large)
    .setColor("Grey")
    .setFields(
        {name: "Anime watched", value: `${userInfo.Viewer.statistics.anime.count}`, inline: true},
        {name: "Manga read", value: `${userInfo.Viewer.statistics.manga.count}`, inline: true}
    )
    .setFooter({text: userInfo.Viewer.siteUrl})

    //TO BE REPLACED WITH USER EMBED FUNCTION FROM LIAM

    tokenSubmission.editReply({embeds:[userEmbed]})
    
    
}

module.exports = {
    execute,
    data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("Log in to anilist.co"),
    name: "login"

}
