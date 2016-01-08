var mineflayer = require('mineflayer');

var config = require('./config.json');

var options;
if(config.password && config.password != "") {
    options =  {
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        verbose: config.verbose
    }
} else {
    options =  {
        host: config.host,
        port: config.port,
        username: config.username,
        verbose: config.verbose
    }
}

var bot = mineflayer.createBot(options);

//example of adding a plugin
//require('./node_modules/mineflayer/lib/plugins/entities')(bot);

bot.on('login', function() {
    console.log('Tyrone has established connection.')
})

//echoes any chat messages
bot.on('chat', function(username, message) {
    if (username === bot.username) return;
    bot.chat("What up dog");
});

bot.on('error', function(err) {
    console.log(err);
});