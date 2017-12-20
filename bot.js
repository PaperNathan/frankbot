// Import the discord.js module
const Discord = require('discord.js');
const auth = require('./auth.json');
const fs = require('fs');

const client = new Discord.Client();

const token = auth.token;

// Ready
client.on('ready', () => {
  console.log('I am ready!');
  client.user.setPresence({game: {name: "with my code", type: 0}});
});

// Create an event listener for messages
client.on('message', message => {
    if(message.author.bot) return;

    // COMMAND:  Save Chat Logs for a Text Channel 
    if (message.author.username == "Twinbee" && message.content == "!save") {
        let writeMsg = [];
        let lastMsg = message.channel.lastMessageID;

        msgCollection(message, lastMsg, writeMsg);
    }

    // =-=-=-=-=-=-=-=-=  TEST COMMANDS  =-=-=-=-=-=-=-=-=-=-=-
    

    // COMMAND:  Bot Speaks Gibberish for Testing
    // if (message.author.username == "Twinbee" && message.content == "!blah") {
    //     let smartTalk = ("abcdefghijklmnopqrstuvwxyz").split("");
    //     let babble = "";
    //     for (i=0; i<100; i++) {
    //         babble = "";
    //         let characterLen = Math.floor((Math.random() * 6) + 1);
    //         for (j=0; j<characterLen; j++) {
    //             let letter = Math.floor((Math.random() * 25) + 1);
    //             babble += smartTalk[letter];
    //         }
    //         message.channel.send(babble);
    //     }
    //     message.channel.send('finished!');
    // }

    // COMMAND:  Bot Counts to 100 for Testing
    // if (message.author.username == "Twinbee" && message.content == "!orderedBlah") {
    //     for (i=1; i<=100; i++) {
    //         message.channel.send(i);
    //     }
    // }
        

});

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
        writeToFile(writeMsg, overflowToggle);  //  Sends the Array to be Written to a File
    })
    .catch(console.error);  //  Catches Promise Errors
}

// Writes the Collected Chat Logs to a File [log.txt]
function writeToFile(writeMsg, overflowToggle) {
    console.log('Block Saved!');
    if (overflowToggle == true) {
        for (i=writeMsg.length-1; i>=0; i--) {
            fs.appendFile('log.txt', `${writeMsg[i]} \n`, (err) => {
                if (err) throw err;
            })
        }
    }
}


// Bot Login
client.login(token);
