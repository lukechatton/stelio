var mineflayer = require('mineflayer');
var navigatePlugin = require('mineflayer-navigate')(mineflayer);

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

//navigation plugin
navigatePlugin(bot);


// ===================== //
//      NAVIGATION       //
// ===================== //

var master = '';

setInterval(function() {
    if(master != '' && bot.players[master]) {
        bot.navigate.to(bot.players[master].entity.position);
    }
}, 1000);

bot.navigate.blocksToAvoid[132] = true; // avoid tripwire
bot.navigate.blocksToAvoid[59] = true; // ok to trample crops
bot.navigate.on('pathFound', function (path) {
    //bot.chat("found path. I can get there in " + path.length + " moves.");
});
bot.navigate.on('cannotFind', function (closestPath) {
    //bot.chat("unable to find path. getting as close as possible");
    bot.navigate.walk(closestPath);
});
bot.navigate.on('arrived', function () {
    //bot.chat("I have arrived");
});
bot.navigate.on('interrupted', function() {
    bot.chat("stopping");
});
bot.on('chat', function(username, message) {
    // navigate to whoever talks
    if (username === bot.username) return;
    var target = bot.players[username].entity;
    if(message == 'setmaster') {
        console.log('setting master to ' + username);
        master = username;
    }
    else if (message === 'come') {
        bot.navigate.to(target.position);
    }
    else if (message === 'stop') {
        bot.navigate.stop();
    }
});








// ===================== //
//         MISC          //
// ===================== //


bot.on('login', function() {
    console.log(bot.username + ' has established connection.')
})

//echoes any chat messages
//bot.on('chat', function(username, message) {
//    if (username === bot.username) return;
//    bot.chat("What up dog");
//});

bot.on('error', function(err) {
    console.log(err);
});