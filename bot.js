// Import the discord.js module
const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();

const token = config.token;
const prefix = config.prefix;

// Ready
client.on('ready', () => {
  console.log('I am ready!');
  client.user.setPresence({game: {name: "with my code", type: 0}});
});

// Create an event listener for messages
client.on('message', message => {
    if(message.author.bot) return;

    if (message.content[0] == prefix && message.content[1]) { 
        let userCommand = message.content.toString().substring(1).split(" ");  // Removes the prefix ('!') and splits the command away from the arguments

        switch(userCommand[0]) {
            case "save":  //  Save Chat Logs for a Text Channel
                let writeMsg = [];
                let lastMsg = message.channel.lastMessageID;
        
                msgCollection(message, lastMsg, writeMsg);
            break;

            case "babble":  // !babble <number> makes the bot send random chat messages for testing other functions.  [Max 1 Message per Second]

                if (!userCommand[1]) message.channel.send("Please add an arguement (number).  [ex. !command <number>]");
                babble(message, userCommand[1]);

            break;

            case "count":  // !count <number> makes the bot count to that number 1 message at a time
                if (!userCommand[1]) message.channel.send("Please add an arguement (number).  [ex. !command <number>]");
                count(message, userCommand[1]);
            break;

            case "help":
                message.channel.send({embed: {
                    color: 3447003,
                    author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                    },
                    title: "FrankBot Documentation",
                    url: "https://github.com/PaperNathan/frankbot",
                    description: "Here's a quick summary of FrankBot's Commands.  \n",
                    fields: [{
                        name: "!save",
                        value: "Allows you to save the entire Text Channel Chat Log."
                    },
                    {
                        name: "!babble <number>",
                        value: "Creates an unordered list of random strings and sends them to the Text Channel." 
                    },
                    {
                        name: "!count <number>",
                        value: "Creates an ordered list of numbers and sends them to the Text Channel."
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                    icon_url: client.user.avatarURL
                    }
                }
                });
            break;
            
            default:
                message.channel.send("I'm sorry, I didn't understand that command. Try !help.");
        }
    }
});
        
// =-=-=-=-=-=  Functions for User Commands  =-=-=-=-=-=-=

//  Collects All of a Text Channels Chat Logs
function msgCollection(message, lastMsg, writeMsg) {
    let overflowToggle = true;

    //  Works Reverse Chronologically:  It Grabs Recent Messages First and Works Backwards.
    message.channel.fetchMessages({ limit: 100, before: lastMsg })
    .then(messages => {
        messages.array().forEach((message, index)=>{  //  Funnels the last 100 Messages into an Array
            writeMsg.push(`${message.author.username.toString()}: ${message.content}`);  //  Writes the Message Author and Content to an Array

            //  Checks if a Text Channel has more than 100 Messages and Recursively Readies the Second Block of 100 Messages
            if (index == 99) {
                lastMsg = message.id;
                overflowToggle = false;  //  Toggle to Make Sure All Messages are Collected in The Array Prior to being Written to a File.
                msgCollection(message, lastMsg, writeMsg)
            }
        })
        writeToFile(message, writeMsg, overflowToggle);  //  Sends the Array to be Written to a File
    })
    .catch(console.error);  //  Catches Promise Errors
}


// Writes the Collected Chat Logs to a File [log.txt]
function writeToFile(message, writeMsg, overflowToggle) {
    console.log('Block Saved!');
    if (overflowToggle == true) {

        let d = new Date();
        let fileName = message.channel.name + "-" + d.getTime().toString() + '.txt';

        for (i=writeMsg.length-1; i>=0; i--) {
            fs.appendFile(fileName, `${writeMsg[i]} \n`, (err) => {
                if (err) throw err;
            })
        }

    }

}

// Writes an unordered list of random strings to a TextChannel
function babble(message, num) {
    let consonants = ("bcdfghjklmnpqrstvwxyz").split("");
    let vowels = ("aeiou")
    let babble = "";

    for (i=0; i<2; i++) {
        babble = "";
        let characterLen = Math.floor((Math.random() * 7) + 2);
        for (j=0; j<Math.floor(characterLen / 2); j++) {
            let con = Math.floor((Math.random() * 20));
            let vow = Math.floor((Math.random() * 4))
            babble += consonants[con] + vowels[vow];
        }
        message.channel.send(babble);
    }

}

// Writes an ordered list of strings to a TextChannel
function count(message, num) {
    for (i=1; i<=num; i++) {
        message.channel.send(i);
    }
}


// Bot Login
client.login(token);


// =-=-=-=-=-=  Unused Logic  =-=-=-=-=-=-=

// if(message.author.id == message.guild.owner.id) {};   // Channel Owner Lock
