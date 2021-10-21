/*
 *
 *  BOT written by Patrick Kvaksrud (patrick@kvaksrud.no)
 *  https://github.com/Kvaksrud/CoolBot
 *  DOB: 2021-10-21
 *  Description: This bot was created to support the TCGC community with a fresh and uniqueue bot for supporting Discord and The Isle
 *  Licence: MIT
 * 
 */

/*
 * Config
 */
const config = require('./config.js')
require('dotenv').config(); // Include environment variables

// Discord
const { Client, Intents, MessageAttachment, SystemChannelFlags } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });

// Log ready state
bot.on('ready', () => {
    console.log('bot logged in to Discord')
});

/*
 * Functions
 */
function hasDiscordRole(message,roleName){
    // Check if role exists on user sending message
    return message.member.roles.cache.some(role => role.name === roleName);
}

/*
 * Event handling
 */


// Login and start working
bot.login(process.env.DISCORD_BOT_TOKEN);