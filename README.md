# Discord.js v12 Bot Template

## Instillation
- Install the recomended [node.js](https://nodejs.org/en/)

## MongoDB Setup
Follow these steps to ensure that the bot will be working properly:

- Create your [mongo](https://www.mongodb.com/) account
- Select `javascript` and click `continue`
- Select your prefered cloud provider and `create cluster`

- Click `connect` then `Ad your current IP address` and create your database user
- Next, click on `choose a connection method` and `connect your application`
- Copy the link and replace "url" it in your config.js file with your coppied link
- Replace `<password>` with the password you used to create your Mongo account

## Configuration
In the `config.js` file, edit all that apply. 

- `prefix` replace inside the `''` with your desired command prefix.
- `token` replace with your token which you can find [here](https://discord.com/developers/applications/)
- `mongoPath` read above for instructions
- `name` replace 'server name' with your server name
- `id` replace all channel ID's that apply
- `symbol` replace `back` " currency" with desired name (keep the space before)
- `economy message` replace with desired messages

![alt text](config.png)

# Bugs and Issues
There are many bugs in the code. This was created in discord.js v12 which is no longer supported. For questions you can contact me on discord, `shorty#9999`

#Set Up a Discord Bot
Create a discord application to get a token

- Login and create an application [here](https://discord.com/developers/applications)
- Inside the new application click `Bot` then `Add Bot`
- Allow `Privileged Gateway Intents`
- Copy the `token` and paste it in your config.js file

# Starting The Bot
To start the bot, simply run the `start.bat` file by double clicking it. It should say `Connected to Discord` and `Connected to Mongo` on a successful start. 