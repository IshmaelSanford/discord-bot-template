IMPORTANT APPLICATIONS
----------------------
Install the "Recommended For Most Users" option from https://nodejs.org/en/
(optional) https://code.visualstudio.com/ to easily edit files

HOW TO SET UP A DISCORD BOT
---------------------------
Log in and create an application in https://discord.com/developers/applications
Go inside that newly created application, click on "Bot" on the left of the screen, and click on "Add Bot"
Underneath the username of the bot, copy the token, head over to config.js and paste that token in the quotations beside "token"
Below the token, there should be the field called "Privileged Gateway Intents", make sure to enable both like so: https://imgur.com/a/UrB5T6b

HOW TO INVITE YOUR DISCORD BOT
------------------------------
Still on the application website, click on "General Information" on the left of the screen
Underneath the information of the bot, you should see "CLIENT ID", copy that and head over to https://discordapi.com/permissions.html
Paste the "CLIENT ID" at the bottom of the screen, it will be indicated by the website
The website may look complex but you really do not need to care about most of the things it's showing you, simply tick the permissions you want the bot to have and click on the link at the bottom of the screen to invite the bot to the discord server of your choice

HOW TO SET UP YOUR MONGODB WEBSITE
----------------------------------
This only matters if your bot requires a database, you can check if it needs one by seeing if "mongoPath" exists in your config.js
If it doesn't, you can ignore this entire section and head on straight to "STARTING YOUR BOT"
Go to https://www.mongodb.com/ and create your account
You should see something like this: https://imgur.com/a/GmS3bj8
Most of those aren't important, just click on "Javascript" and then "Continue" on the bottom right-hand corner of the screen
Click on the free cluster option and you should see something like this: https://imgur.com/a/lVUkFVf
You can select whichever cloud provider and region so long as it's closest to your current location, after that click 'Create Cluster' and wait for the website to create your cluster

Click on "CONNECT" under your cluster: https://imgur.com/a/hRqYTf2 and this should prompt: https://imgur.com/a/tUJXFPR
Click on "Add your Current IP Address" and create your database user, remember the Password you're typing because you will need that later on
After that, click on "Choose a connection method" on the bottom right hand corner of the prompt, and click on "Connect your application": https://imgur.com/a/fwEhFyp
Copy the link from the next page and paste that in the quotations beside "mongoPath"
Replace the entire <password> from the link you just pasted in "mongoPath" with the password that you're supposed to remember.

STARTING YOUR BOT
-----------------
Run start.bat and a command prompt should show saying "Connected to Discord" (and "Connected to Mongo" if you have a Mongo database)
You're all done!