var Discord = require('discord.js');
var auth = require('./auth.json');
var config = require('./config.json');
var commands = require(`./${config.commands}`)

var bot = new Discord.Client();

function addCommand(cmd, value) {
  commands['commands'].push({
    trigger: cmd,
    response: value
  });
  return;
}

function listCommands(message) {
  var cmds = JSON.stringify(commands);
  message.channel.send(`${cmds}`);
  return;
}

function saveCommands() {
  var fs = require('fs');
  fs.writeFile(`./${config.commands}`, JSON.stringify(commands), function (err) {
    if (err) {
      console.log(err);
    }
  });
  return;
}

let botName;
bot.on('ready', () => {
  console.log('%s - %s\n', bot.user.tag, bot.user.id);
  botName = bot.user.username;
});

bot.on('message', message => {
  if (message.content.startsWith(`${config.prefix}`)) {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      case 'add':
        message.channel.send('New command received');
        addCommand('hi', 'hello');
        break;
      case 'list':
        message.channel.send('List received');
        listCommands(message);
        break;
      case 'save':
        message.channel.send('Save received. Saving to file...');
        saveCommands();
        break;
    }
  } else if (message.author.username != botName) {
    message.channel.send(message.content);
  }
});

bot.login(auth.token)