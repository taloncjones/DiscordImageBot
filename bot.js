var Discord = require('discord.js');
var auth = require('./auth.json');
var config = require('./config.json');
var commands = require(`./${config.commands}`)

var bot = new Discord.Client();

function addCommand(cmd, value) {
  commands[cmd] = value;
  return;
}

function listCommands(message) {
  var cmds = JSON.stringify(commands);
  message.channel.send(`${cmds}`);
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
      case 'save':
        message.channel.send('Save received');
        addCommand('hi', 'hello');
        break;
      case 'list':
        message.channel.send('List received');
        listCommands(message);
        break;
    }
  } else if (message.author.username != botName) {
    message.channel.send(message.content);
  }
});

bot.login(auth.token)