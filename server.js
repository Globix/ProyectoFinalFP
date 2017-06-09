var restify = require('restify');
var builder = require('botbuilder');
var moduloTextos = require("./textos/textos.js")
var moduloRutas = require("./textos/rutasDialogos.js")

const moduloUtilidades = require('./funciones/utilidades.js')

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
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

var LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/3944a83e-cca9-4fe4-a5b8-15a28684b42f?subscription-key=81b72731266e4327ac8c58eb730ce661&timezoneOffset=0&verbose=true&q=';
// bot.recognizer(new builder.LuisRecognizer(model));

var recognizer = new builder.LuisRecognizer(LuisModelUrl);
const intents = new builder.IntentDialog({
    recognizers: [recognizer]
});

var sinRespuesta
intents.matches('Saludar', moduloRutas.rutas["saludar"]);
intents.matches('VisitaGuiada', moduloRutas.rutas["visitaGuiada"]);
intents.matches('None', moduloRutas.rutas["sinRespuesta"]);
intents.matches('EstadoAnimo', moduloRutas.rutas["estadoAnimo"]);

var ultimoDialogo ="" // Variable utilizada debido a que LUIS no es muy preciso, y reducira el error.

bot.dialog('/', intents);

intents.onDefault(moduloRutas.rutas["sinRespuesta"], {mensajePrimeraVez: true})

bot.dialog(moduloRutas.rutas["obtenerNombre"], [
    function (session, args) {
        session.dialogData.textosAyuda = args.textosAyuda;
        builder.Prompts.text(session, moduloTextos.diccionario["preguntaNombre"]);
    },
    function (session) {
        session.userData.name = session.message.text;
        session.userData.ayuda = 3;
        session.send(moduloTextos.diccionario["nombreGuardado"] + session.userData.name);
        session.endDialogWithResult({preguntaAyuda: true})
    }]
);

bot.dialog(moduloRutas.rutas["saludar"], [
    function (session) {
        if(ultimoDialogo != moduloRutas.rutas["saludar"]){
            if (session.userData.name == undefined || session.userData.name == null){
                if (moduloUtilidades != undefined){
                    moduloUtilidades.saludar(session);
                }
                session.send(moduloTextos.diccionario["presentacion"]);
                session.beginDialog(moduloRutas.rutas["obtenerNombre"], {textosAyuda: true});
            } else {
                var next = this[1];
                next(session, {segundoSaludo: true});
            }
        } else {
            session.beginDialog(moduloRutas.rutas["sinRespuesta"]);
        }
    }, function (session, args) {
        if (args.segundoSaludo == true){
            session.send(moduloTextos.diccionario["segundoSaludo"] + session.userData.name);
        }
        if (args.preguntaAyuda == true){
            session.send(moduloTextos.diccionario["preguntaAyuda"]);
            if (moduloUtilidades != undefined && moduloUtilidades != null){
                moduloUtilidades.mostrarMensajeVisitaGuiada(session);
            }
        }
        ultimoDialogo = moduloRutas.rutas["saludar"]
        session.endDialog();
    }]
);

bot.dialog(moduloRutas.rutas["estadoAnimo"], [
    function (session) {
        session.send(moduloTextos.diccionario["estadoAnimo"]);
        builder.Prompts.text(session, moduloTextos.diccionario["preguntaAnimo"]);
    },
    function (session) {
        builder.LuisRecognizer.recognize(session.message.text, LuisModelUrl, function(err, intents){
            switch (intents[0].intent){
                case 'Alegre':
                    session.send(moduloTextos.diccionario["estadoAnimoAlegre"]);
                    break;
                case 'Triste':
                    session.send(moduloTextos.diccionario["estadoAnimoTriste"]);
                    break;
                case 'Enfadado':
                    session.send(moduloTextos.diccionario["estadoAnimoEnfadado"]);
                    break
                default:
                    session.send(moduloTextos.diccionario["estadoAnimoPorDefecto"])
            }
        });
        setTimeout(function() {
            session.send(moduloTextos.diccionario["preguntaMasAyuda"]);
        }, 1500);
        session.endDialog();
    }
])

bot.dialog(moduloRutas.rutas["visitaGuiada"], [
    function (session, next) {
        if (session.userData.name == undefined || session.userData.name == null){
            session.beginDialog("/obtenerNombre", session);
        } else {
            var next = this[1];
            next(session);
        }
    },
    function (session) {
        builder.Prompts.choice(session, moduloTextos.diccionario["opcionesVisitaGuiada"], ["Estudiante", "Empresa"], { listStyle: builder.ListStyle.button });
    }]
);

bot.dialog(moduloRutas.rutas["sinRespuesta"],
    function (session){
        session.send(moduloTextos.diccionario["sinRespuesta"]);
        if (session.userData.name == undefined || session.userData.name == null){
            session.send(moduloTextos.diccionario["primeraVez"]);
        }
        if (moduloUtilidades != undefined && moduloUtilidades != null){
            moduloUtilidades.mostrarMensajeVisitaGuiada(session);
        }
        session.userData.ayuda++;
        session.endDialog();
    }
);
