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

var health = 20;
var food = 20;

//setInterval(function() {
//    if(master != '' && bot.players[master]) {
//        bot.navigate.to(bot.players[master].entity.position);
//    }
//}, 1000);

var dancingB = false;

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
bot.on('death', function() {
  bot.navigate.stop();
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
        dancingB = false;
        //bot.navigate.stopFollowing();
    }
    else if (message === 'follow') {
        bot.navigate.follow(target.username);
    }
    else if (message === 'attack') {
        bot.navigate.follow(target.username);
        setInterval(function() {
            bot.attack(target);
        }, 100);
    }
    else if (message === 'dance') {
        dance();
    }
});


// ===================== //
//        COMBAT         //
// ===================== //


// Fires on health or food change
/*
 Doesn't work reliably for some reason.
 It only recognizes health loss once, then
 it has to re-gain health before it notices
 loss again, and same with gaining.
*/
bot.on('health', function() {
  // If bot lost health
  if (bot.health < health) {

  }
  // If bot gained health
  else if (bot.health > health) {

  }

  // If bot lost food
  if (bot.food < food) {
  
  }

  health = bot.health;
  food = bot.food;
});


// ===================== //
//         MISC          //
// ===================== //


bot.on('login', function() {
    console.log(bot.username + ' has established connection.')
});
bot.on('spawn', function() {
  health = bot.health;
  food = bot.food;
});

//echoes any chat messages
//bot.on('chat', function(username, message) {
//    if (username === bot.username) return;
//    bot.chat("What up dog");
//});

function dance() {
    dancingB = true;
    var dancing = setInterval(function(){
        var min = 0,
            max = 2;
        var rand = randInt(0, 3);
        switch(rand) {
        case 0:
            bot.setControlState('jump', true);
            bot.setControlState('jump', false);
            break;
        case 1:
            bot.look(randInt(0, 180), randInt(0, 90), true);
            break;
        case 2:
            bot.activateItem();
        }

        if (dancingB === false) {
            clearInterval(dancing);
        }
    }, 100);
}

bot.on('error', function(err) {
    console.log(err);
});

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}