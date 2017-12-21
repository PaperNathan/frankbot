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

    // if(message.content[0] != prefix) {
    //     message.channel.send("hey");
    // }

    if (message.content[0] == prefix && message.content[1]) {
        let userCommand = message.content.toString().substring(1);

        switch(userCommand) {
            case "save":  //  Save Chat Logs for a Text Channel
                let writeMsg = [];
                let lastMsg = message.channel.lastMessageID;
        
                msgCollection(message, lastMsg, writeMsg);
            break;

            case "test":
                // message.channel.send("This command is reserved for testing new functions.");
            break;
            
            default:
                message.channel.send("I'm sorry, I didn't understand that command.");
        }
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


// Bot Login
client.login(token);
