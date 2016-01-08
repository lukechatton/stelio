var mineflayer = require('mineflayer');

var bot = mineflayer.createBot({
    host: "localhost", // optional
    port: 25565,       // optional
    username: "snicktrix@gmail.com", // email and password are required only for
    password: "----",          // online-mode=true servers
});

//example of adding a plugin
//require('./node_modules/mineflayer/lib/plugins/entities')(bot);


//echoes any chat messages
bot.on('chat', function(username, message) {
    if (username === bot.username) return;
    bot.chat(message);
});

bot.on('error', function(err) {
    console.log(err);
});