var Discord = require('discord.js');
var auth = require('./auth.json');

var bot = new Discord.Client();

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
        message.channel.send('Send received');
        break;
      case 'list':
        message.channel.send('List received');
        break;
    }
  } else if (message.author.username != botName) {
    message.channel.send(message.content);
  }
});

bot.login(auth.token)