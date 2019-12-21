var Discord = require('discord.io');

var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

bot.on('ready', function() {
  console.log('%s - %s\n', bot.username, bot.id);
});

bot.on('message', function(user, userID, channelID, message, event) {

});