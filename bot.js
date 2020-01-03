var Discord = require('discord.js');
var auth = require('./auth.json');
var config = require('./config.json');
var commands = require(`./${config.commands}`)

var bot = new Discord.Client();

function addCommand(cmd, value) {
  commands['commands'].push({
    keyword: cmd,
    response: value
  });
  return;
}

function isCommand(message) {
  return message.content;
}

function listCommands(message) {
  var cmds = commands['commands'];
  var msg = ""

  cmds.forEach(pair => {
    msg += "Keyword: " + pair['keyword'] + "\tResponse: " + pair['response'] + "\n"
  });
  message.channel.send(msg);
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

function isAdmin(member) {
  if (member.roles.find(r => config.roles.includes(r.name))) {
    return true;
  } else {
    return false;
  }
}

let botName;
bot.on('ready', () => {
  console.log('%s - %s\n', bot.user.tag, bot.user.id);
  botName = bot.user.username;
});

bot.on('message', message => {
  if (message.content.startsWith(`${config.prefix}`) && isAdmin(message.member)) {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      case 'add':
        if (args.length !== 2) {
          message.channel.send('Two arguments required. E.g. "!add [keyword] [response]"');
          break;
        } else {
          message.channel.send(`New command received. Added - Keyword: ${args[0]} Response: ${args[1]}`);
          addCommand(args[0], args[1]);
          break;
        }
      case 'list':
        listCommands(message);
        break;
      case 'save':
        message.channel.send('Save received. Saving to file...');
        saveCommands();
        break;
    }
  } else if (message.author.username != botName) {
    message.channel.send(isCommand(message));
  }
});

bot.login(auth.token)