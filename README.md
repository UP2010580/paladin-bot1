# Paladin - A discord bot

Paladin is a discord bot created to help lecturers with tedious tasks in the University of Portsmouth School of Computing Discord

## Installation

### Getting started

#### Install node

Firstly, install node. I suggest the LTS version, found [here][1]. 

#### Create a new discord application

Next you need to create a new discord application. Head over to the [discord developer portal][2] and once logged in, create a new application by clicking the blue button in the top right labelled New Application. 

Once created, give it a description and some tags, and move to the Bot section on the left nd add a bot. 

The final thing to do is enable all the gateway intents and invite the bot to a server.

Head over to OAuth2, check the bot and applications.cmmands scopes, as well as any you may think you'll need while developing. I reccomend giving your bot the Administrator permissions. Then generate URL, paste, and go!

### Create MongoDB Collection

Head over to [MongoDB Atlas][4] and create an account if you haven't already got one. Now move on to create a database and choose your option of database. 

Now is the security quickstart time, create a safe and secure username and password for your database. After create safe IP addresses. do "0.0. 0.0/0" to make any ip address safe and allow connections to your database from anywhere if you wish. With this your DB is set up.

Now after clicking "go to databases", click "connect" and then drivers. Note the long string that looks like: mongodb+srv://YOURUSERNAME:\<password>@cluster0.rqtt1gh.mongodb.net/?retryWrites=true&w=majority, you'll need it later where *\<password>* is replaced with the password you just created for your database. 

Create a new folder in Visual Studio Code (or any IDE that supports JavaScript editing), open a terminal in your IDE and use ```npm init -y``` to generate a package.json file. 

```popwershell
npm init -y
```

One this package.json file has been generated, copy and paste the every file from source into the same folder, overwriting the package.json file.

Once the files are in place, run ```npm install discord.js```. This will install all the relevant depencies.

```powershell
npm install discord.js
```

Finally, this is optional but reccomended if you plan to further develop this bot, do ```npm install -g nodemon```. 
```powershell
npm install -g nodemon
```
You may need to run powershell in administrator and run ```Set-ExecutionPolicy RemoteSigned -Scope CurrentUser``` to get nodemon to start. See [stack overflow][3] for a longer explanation.

Once complete, begin configuration.

## Configuration

### Suggested roles and channels to add

|Role | Explanation |
| - | -------|
| Initial Role | This is the role given to users when they join the server, so it should have low permissions. I reccomend making it able to see only one channel, the join channel|
| Match role and course code | In /infoupdate command, match the case with the role that is added to the user in the trycatch block |
| Year Roles | Create roles for each different year, note that the roles begin at 1 and not 0 |

| Channel | Explanation |
| - | -------|
| Moderator Only channel | A channel that you need to have moderator (or higher) permissions in order to see|
| Join channel | This is the channel that users with the initial role should be able to see. To reduce clutter in servers, remove this from view of anyone who doesn't have the initial role, otherwise it's convenient to keep it there so users can see the reply from using /infoUpdate |


Paladin is built to be added to one discord, and as such has a lot of customisation to do before it is completely ready to be updated. Below is a list of files that need customisation before the bot will be operational, which line needs to be updated, and what information needs to be added.


| File in need of customisation | Line(s) to customise | What information to add |
| --- | --- | --- |
|  .envEXAMPLE | 1-4  | Explained in file. Also rename to ".env"  |
| config.json | 2-4 | For future commands, change "testServer" to test server ID,  "clientID" to Application ID which can be found [here][2], "Devs" array to include developers discord account IDs"
|   infoupdate.js | 177, 179, 201-206, 215 | Each specified individually in file|
| eventHandler.js | 27, 32, 42 | Specified in file |
| bannedWords.js | 1 | Add banned words, users with those words in their usernames will not be allowed in the server. |
| courseCodes.js | 1 | Add other course codes |

## Once configured

Once configured, run ```nodemon``` and your bot should come online. Every time you make a change to your folder, with nodemon, your bot will be restarted upon saving.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

[1]:https://nodejs.org/en
[2]:https://discord.com/developers/applications
[3]:https://stackoverflow.com/questions/63423584/how-to-fix-error-nodemon-ps1-cannot-be-loaded-because-running-scripts-is-disabl
[4]:https://account.mongodb.com/account/login