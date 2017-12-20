# FrankBot v1.0
*A Discord Bot for Saving Chat Logs*

### What is FrankBot
After searching around the internet, I couldn't find a way to archive discord conversations so I could clean up our 
text channels.  So, I made one.

FrankBot will read through a Text Channel's history and save the username and message content to a text file.

### Commands

##### !save
This command goes through ever sent message and saves it to a text file.

### Make FrankBot Work
To make FrankBot Work you're going to need a few things.  
1. [nodeJS](https://nodejs.org/en/) installed on your computer.  
1. A [TextEditor](https://code.visualstudio.com/).  
1. You'll need to [register your own discord app](https://discordapp.com/developers/) and get a token. 
1. You'll need to invite your bot to your server.
1. You'll need to create a file in FrankBot's root folder called *auth.json* and inside this file you'll need to copy paste the code below.

```javascript
{
    "token": "YOUR_TOKEN_GOES_HERE"
}
```

After that, just run *node bot.js* in your Terminal.

### WARNING
At the moment, FrankBot only creates **ONE** *log.txt*.  If you run the **!save** command more than once, he will append all of your Text Channel messages to the *log.txt* file twice.

### The Future

- [x] Save Sent Messages, Links, Code
- [ ] Save Chat Logs based on Channel Name and Date
- [ ] Save Sent Photos
- [ ] Save Sent File Names
- [ ] Rebuild Archived but Deleted Chat Logs
