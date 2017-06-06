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
    // appId: process.env.MICROSOFT_APP_ID,
    // appPassword: process.env.MICROSOFT_APP_PASSWORD
};

// Create bot
var connector = new builder.ChatConnector(botConnectorOptions);
var bot = new builder.UniversalBot(connector);

// Handle Bot Framework messages
server.post('/api/messages', connector.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
    'directory': '.',
    'default': 'index.html'
}));

var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/3944a83e-cca9-4fe4-a5b8-15a28684b42f?subscription-key=81b72731266e4327ac8c58eb730ce661&timezoneOffset=0&verbose=true&q=';
bot.recognizer(new builder.LuisRecognizer(model));

bot.dialog('/', function (session) {

    //respond with user's message
    session.send("You said " + session.message.text);
});

bot.dialog('PruebaLUIS', function (session) {
    session.send("Prueba LUIS saludo CON EXITO");
}).triggerAction({
    matches: 'Saludar'
});