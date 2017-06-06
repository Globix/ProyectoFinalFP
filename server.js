var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Get secrets from server environment
var botConnectorOptions = {
    appId: "6439a638-2be2-4a01-b327-ba29b08db5c5",
    appPassword: "zEHyAD8CtipJpER92CukqXt"
};

// Create bot
var connector = new builder.ChatConnector(botConnectorOptions);
var bot = new builder.UniversalBot(connector);

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Serve a static web page para saber si el bot esta bien desplegado
server.get(/.*/, restify.serveStatic({
    'directory': '.',
    'default': 'index.html'
}));

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: '%s'. Try asking for 'help' or say 'goodbye' to quit", session.message.text);
});

bot.dialog('/', function (session) {

    //respond with user's message
    session.send("You said " + session.message.text);
});