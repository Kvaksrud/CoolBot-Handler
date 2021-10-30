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
const { Client, Intents, MessageAttachment, SystemChannelFlags, ReactionUserManager } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_VOICE_STATES] });

const channelLib = require('./lib/channel.js');
const { forEach, matches } = require('lodash');
const { count } = require('console');

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
/*bot.on('guildMemberAdd', member => { // New member added
    
});*/

bot.on('voiceStateUpdate', async (oldState,newState) => { // Voice
    let guild = bot.guilds.cache.get(process.env.DISCORD_GUILD);

    if(oldState.channelId === newState.channelId){ // Stop execution if no channel has been changed
        console.log('User changed a setting but is still in the same channel',newState.member.id,newState.member.user.username);
        return;
    }
    

    if(newState.channelId === null){ // User left voice chat

    }
    

    if(oldState.channelId !== null){ // User left a channel
        console.log(oldState);
        if(oldState.channel.name.split('#').length > 1){
            console.log('check for delete');
            var nameRegex = new RegExp("([a-z].*) #([0-9]{1,2})", "gi");
            match = nameRegex.exec(oldState.channel.name);
            if(match.length !== 3) {
                console.log('Something wrong with the channel delete regex match. Length is not the expected 3: ',match,match.length);
                return;
            }

            console.log('Check channel for delete',oldState.channel.name);
            if(config.CHANNELS_AUTO_DELETED.includes(match[1].toLowerCase()) !== true){
                console.log('Channel matches autodelete pattern, but is not in the allowed list',match);
                return;
            }

            //console.log('Users in old channel',oldState.channel.members);
            let i = 0;
            oldState.channel.members.forEach(function(channel){ i++; }) // Count active users
            if(i === 0){
                console.log('delete channel',oldState.channel.name);
                oldState.channel.delete().catch(err => {
                    console.error(err);
                })
            } else
                console.log('keep channel',oldState.channel.name,'with',i,'members still inside');
        }
    }

    if(newState.channelId !== null){ // User joined a VC
        if(newState.channel.name.toLowerCase() === '➕ create channel'){
            
            let channels = await newState.guild.channels.fetch().then(channels => {
                return channels.filter(channel => channel.parentId === newState.channel.parentId && channel.type === 'GUILD_VOICE' && channel.name.toLowerCase() !== '➕ create channel');
            });
            console.log(channels);

            let usedNumbers = [];
            channels.forEach(function(channel){
                let number = channel.name.split('#');
                if(number[1])
                    usedNumbers.push(parseInt(number[1]));
            })
            console.log('used: ',usedNumbers);

            let foundNumber = false;
            let i = 0;
            while(foundNumber !== true){
                i++;
                if(usedNumbers.includes(i) === false){ // The number is not present i Discord
                    foundNumber = true;
                }
            }

            let prefix = '';
            let num = 0;
            if(newState.channel.parent.name.toLowerCase().startsWith('hangout')) {
                num = Math.floor(Math.random() * config.PREFIXES.HANGOUT.length);
                prefix = config.PREFIXES.HANGOUT[num]; // Select random prefix
            } else if(newState.channel.parent.name.toLowerCase().startsWith('herbivore')) {
                num = Math.floor(Math.random() * config.PREFIXES.HERBIVORE.length);
                prefix = config.PREFIXES.HERBIVORE[num]; // Select random prefix
            } else if(newState.channel.parent.name.toLowerCase().startsWith('carnivore')) {
                num = Math.floor(Math.random() * config.PREFIXES.CARNIVORE.length);
                prefix = config.PREFIXES.CARNIVORE[num]; // Select random prefix
            }

            console.log(prefix + newState.channel.parent.name);
            console.log('num: ',num);

            newState.guild.channels
                .create(prefix + newState.channel.parent.name + ' #' +i.toString(), {
                    type: 'GUILD_VOICE',
                    parent: newState.channel.parent,
                })
                .then((channel) => {
                    //console.log('i',i)
                    //console.log('pos',channel.position)
                    if(channel.position !== i) // Move channel in right numerical order
                        channel.setPosition(i);
                    newState.member.voice.setChannel(channel);
                    return;
                })
                .catch((err) => {
                    console.error(err);
                    return;
                });
            return;
        } else {
            console.log('not create chan');
        };

    } else {
        console.log('channel id = null');
    }
    
/*
    if(guild.id !== process.env.DISCORD_GUILD){
        console.log(`Guild is not whitelisted: ${guild.name} (${guild.id})`); // Does currently not support multi-guild's
        return;
    }

    if(channel.name.toLowerCase().startsWith('Create'))
        console.log('hit');
    else
        console.log('miss');

    console.log(channel.name);*/

});

// Login and start working
bot.login(process.env.DISCORD_BOT_TOKEN);