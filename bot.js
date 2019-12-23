var Discord = require('discord.io');
var auth = require('./auth.json');

var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

let botName;
bot.on('ready', function () {
  console.log('%s - %s\n', bot.username, bot.id);
  botName = bot.username;
});

bot.on('message', function (user, userID, channelID, message, event) {
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      case 'save':
        bot.sendMessage({
          to: channelID,
          message: 'Save received'
        });
        break;
      case 'list':
        bot.sendMessage({
          to: channelID,
          message: 'List received'
        });
        break;
    }
  } else if (user != botName) {
    bot.sendMessage({
      to: channelID,
      message: message.substring(0)
    });
  }
});