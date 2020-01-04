var Discord = require('discord.js');
var auth = require('./auth.json');
var config = require('./config.json');
var commands = require(`./${config.commands}`);

var bot = new Discord.Client();

function addCommand(message, cmd, value) {
  var cmds = commands['commands'];
  var found = false;

  cmds.forEach(pair => {
    if (pair['keyword'] === cmd) {
      found = true;
    }
  });

  if (found) {
    message.channel.send(`${cmd} already exists. Use '!remove ${cmd}' to remove the existing command and try again.`);
    return 1;
  } else {
    commands['commands'].push({
      keyword: cmd,
      response: value
    });
    message.channel.send(`New command received. Added - Keyword: ${cmd} Response: ${value}`);
    return 0;
  }
}

function isCommand(message) {
  var cmds = commands['commands'];
  var response = ""

  cmds.forEach(pair => {
    var keyword = new RegExp("\\b" + pair['keyword'] + "\\b", 'g');
    var found = message.content.match(keyword);
    if (found) {
      response = pair['response'];
    }
  });
  return response;
}

function listCommands(message) {
  var cmds = commands['commands'];
  var msg = "Command list:\n"

  cmds.forEach(pair => {
    msg += "Keyword: " + pair['keyword'] + "\tResponse: " + pair['response'] + "\n"
  });
  message.channel.send(msg);
  return 0;
}

function removeCommand(message, keyword) {
  var cmds = commands['commands'];
  for (let index = 0; index < cmds.length; index++) {
    if (cmds[index]['keyword'] === keyword) {
      commands['commands'].splice(index, 1);
      message.channel.send(`Removed: ${keyword}`);
      return 0;
    }
  }
  message.channel.send('Keyword not found. Use !list to see available keywords.');
  return 1;
}

function saveCommands(message) {
  var fs = require('fs');
  fs.writeFile(`./${config.commands}`, JSON.stringify(commands), function (err) {
    if (err) {
      message.channel.send(err);
      return 1;
    }
  });
  return 0;
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
          if (!addCommand(message, args[0], args[1])) {
            saveCommands(message);
          }
          break;
        }
      case 'list':
        listCommands(message);
        break;
      case 'remove':
        if (args.length !== 1) {
          message.channel.send('Keyword required. E.g. "!remove [keyword]"');
          break;
        } else {
          if (!removeCommand(message, args[0])) {
            saveCommands(message);
          }
          break;
        }
      case 'save':
        if (!saveCommands(message)) {
          message.channel.send('Save received. Saved to file.');
        }
        break;
    }
  } else if (message.author.username != botName) {
    var response = isCommand(message);
    if (response) {
      message.channel.send(response);
    }
  }
});

bot.login(auth.token)