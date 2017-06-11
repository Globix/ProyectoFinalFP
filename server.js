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
    // appId: "6439a638-2be2-4a01-b327-ba29b08db5c5",
    // appPassword: "dyFQFrDUuZt4saNd44ekvGT"
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
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
// intents.matches('Saludar', moduloRutas.rutas["saludar"]);
intents.matches('VisitaGuiada', moduloRutas.rutas["visitaGuiada"]["main"]);
intents.matches('EstadoAnimo', moduloRutas.rutas["estadoAnimo"]);

bot.dialog('/', intents);

intents.onDefault(moduloRutas.rutas["sinRespuesta"], {mensajePrimeraVez: true})

bot.dialog(moduloRutas.rutas["obtenerNombre"], [
    function (session, args) {
        builder.Prompts.text(session, moduloTextos.espanol["preguntaNombre"]);
    },
    function (session) {
        session.userData.name = session.message.text;
        session.userData.ayuda = 3;
        session.send(moduloTextos.espanol["nombreGuardado"] + session.userData.name);
        session.endDialogWithResult({preguntaAyuda: true, mostrarMensajeEleccion: true})
    }]
);

bot.dialog(moduloRutas.rutas["saludar"], [
    function (session, args, next) {
        if (session.userData.name == undefined || session.userData.name == null){
            if (moduloUtilidades != undefined){
                moduloUtilidades.saludar(session);
                moduloUtilidades.getNombre(session);
            }
        } else {
            next({segundoSaludo: true});
        }
    }, function (session, args) {
        if (args.segundoSaludo == true){
            if (moduloTextos.espanol["listaSaludos"][session.privateConversationData.contadorSaludos + 1] != undefined){
                if(session.privateConversationData.contadorSaludos == 0){
                    session.send(moduloTextos.espanol["listaSaludos"][session.privateConversationData.contadorSaludos] + session.userData.name);
                } else {
                    session.send(moduloTextos.espanol["listaSaludos"][session.privateConversationData.contadorSaludos]);
                }
                session.privateConversationData.contadorSaludos++;
            } else {
                session.send(moduloTextos.espanol["listaSaludos"][session.privateConversationData.contadorSaludos] + session.userData.name.toUpperCase());
            }
        }
        if (args.preguntaAyuda == true){
            session.send(moduloTextos.espanol["preguntaAyuda"]);
            if (moduloUtilidades != undefined && moduloUtilidades != null){
                moduloUtilidades.mostrarMensajeVisitaGuiada(session);
            }
        }
        session.endDialog();
    }]
);

bot.dialog(moduloRutas.rutas["estadoAnimo"], [
    function (session, args, next) {
        if (session.userData.name == undefined || session.userData.name == null){
            if (moduloUtilidades != undefined){
                moduloUtilidades.saludar(session);
                moduloUtilidades.getNombre(session);
            }
        } else {
            next();
        }
    },
    function (session) {
        session.send(moduloTextos.espanol["estadoAnimo"]["bot"]);
        builder.Prompts.text(session, moduloTextos.espanol["estadoAnimo"]["pregunta"]);
    },
    function (session) {
        builder.LuisRecognizer.recognize(session.message.text, LuisModelUrl, function(err, intents){
            switch (intents[0].intent){
                case 'Alegre':
                    session.send(moduloTextos.espanol["estadoAnimo"]["alegre"]);
                    break;
                case 'Triste':
                    session.send(moduloTextos.espanol["estadoAnimo"]["triste"]);
                    break;
                case 'Enfadado':
                    session.send(moduloTextos.espanol["estadoAnimo"]["enfadado"]);
                    break
                default:
                    session.send(moduloTextos.espanol["estadoAnimo"]["porDefecto"])
            }
        });
        setTimeout(function() {
            session.send(moduloTextos.espanol["preguntaMasAyuda"]);
        }, 1500);
        session.endDialog();
    }
]);

bot.dialog(moduloRutas.rutas["visitaGuiada"]["main"], [
    function (session, args, next) {
        if (session.userData.name == undefined || session.userData.name == null){
            session.beginDialog(moduloRutas.rutas["obtenerNombre"], session);
        } else {
            next(session);
        }
    },
    function (session, args, next) {
        if (session.userData.estatus == undefined || session.userData.estatus == null){
            builder.Prompts.choice(session, moduloTextos.espanol["visitaGuiada"]["opciones"], [moduloTextos.model["estudiante"], moduloTextos.model["empresa"]], { listStyle: builder.ListStyle.button });
        } else {
            next();
        }
    },
    function (session) {
        if (session.userData.estatus == undefined || session.userData.estatus == null){
            session.userData.estatus = session.message.text.toLowerCase();
        }
        session.beginDialog(moduloRutas.rutas["visitaGuiada"]["indice"], {primeraVez: true});
    }]
);

bot.dialog(moduloRutas.rutas["visitaGuiada"]["indice"], [
    function (session, args) {
        if(session.dialogData.opcionesIndiceValor == undefined){
            session.dialogData.opcionesIndiceValor = moduloUtilidades.montarOpcionesPorValor(moduloTextos.model["opcionesIndice"]);
        }
        if (args != undefined && args.primeraVez != undefined && args.primeraVez == true){
            builder.Prompts.choice(session, moduloTextos.espanol["visitaGuiada"]["inicio"] + session.userData.estatus, session.dialogData.opcionesIndiceValor, { listStyle: builder.ListStyle.button });
        } else {
            builder.Prompts.choice(session, moduloTextos.espanol["preguntaMasAyuda"], session.dialogData.opcionesIndiceValor, { listStyle: builder.ListStyle.button });
        }
    },
    function (session){
        if (session.message.text == session.dialogData.opcionesIndiceValor[session.dialogData.opcionesIndiceValor.length-1]){
            moduloUtilidades.pararDialogoConMensaje(session, moduloTextos.espanol["visitaGuiada"]["parar"]);
            session.send(moduloTextos.espanol["preguntaMasAyuda"]);
        } else {
            switch (session.message.text){
                case moduloTextos.model["opcionesIndice"]["resumen"]:
                    builder.Prompts.choice(session, moduloTextos.espanol["visitaGuiada"]["resumen"] + " '" + moduloTextos.model["resumen"]["quienesSomos"] + "', '" + moduloTextos.model["resumen"]["queHacemos"] + "' y '" + moduloTextos.model["resumen"]["comoLoHacemos"] + "'.", moduloTextos.model["volver"], { listStyle: builder.ListStyle.button })
                    break;
                case moduloTextos.model["opcionesIndice"]["menu"]:
                    session.replaceDialog(moduloRutas.rutas["visitaGuiada"]["menu"], {primeraVez: true});
                    break;
            }
        }
    },
    function (session){
        session.replaceDialog(moduloRutas.rutas["visitaGuiada"]["indice"]);
    }
]);

bot.dialog(moduloRutas.rutas["visitaGuiada"]["menu"], [
    function(session, args){
        if(session.dialogData.opcionesIndiceValor == undefined){
            session.dialogData.opcionesIndiceValor = moduloUtilidades.montarOpcionesPorValor(moduloTextos.model["opcionesMenu"][session.userData.estatus]);
        }
        if (args != undefined && args.primeraVez != undefined && args.primeraVez == true){
            builder.Prompts.choice(session, moduloTextos.espanol["visitaGuiada"]["menu"], session.dialogData.opcionesIndiceValor, { listStyle: builder.ListStyle.button });
        } else {
            builder.Prompts.choice(session, moduloTextos.espanol["preguntaMasAyuda"], session.dialogData.opcionesIndiceValor, { listStyle: builder.ListStyle.button });
        }
    },
    function(session, args, next){
        if (session.message.text == session.dialogData.opcionesIndiceValor[session.dialogData.opcionesIndiceValor.length-1]){
            moduloUtilidades.pararDialogoConMensaje(session, moduloTextos.espanol["visitaGuiada"]["parar"]);
            session.send(moduloTextos.espanol["preguntaMasAyuda"]);
        } else {
            if(session.dialogData.opcionesIndiceClave == undefined){
                session.dialogData.opcionesIndiceClave = moduloUtilidades.montarOpcionesPorClave(moduloTextos.model["opcionesMenu"][session.userData.estatus]);
            }
            var informacionDisponible = false;
            for (var i = 0; i < session.dialogData.opcionesIndiceValor.length; i++){
                if (session.message.text == session.dialogData.opcionesIndiceValor[i]){
                    session.send(moduloTextos.espanol["informacionOpcionMenu"][session.userData.estatus][session.dialogData.opcionesIndiceClave[i]])
                    informacionDisponible = true;
                }
            }
            if (informacionDisponible == false){
                session.send(moduloTextos.espanol["informacionNoDisponible"]);
            }
            session.replaceDialog(moduloRutas.rutas["visitaGuiada"]["menu"]);
        }
    },
]);

// bot.dialog(moduloRutas.rutas["visitaGuiada"]["parar"],
//     function(session){
//         moduloUtilidades.pararDialogoConMensaje(session, moduloTextos.espanol["visitaGuiada"]["parar"])
//     });

bot.dialog(moduloRutas.rutas["sinRespuesta"],
    function (session, next){

        // Primero antes de darnos por vencidos, intentaremos ver si el mensaje lleva una entidad relacionada con el saludo.
        // Si no devolveremos que no tenemos respuesta para el mensaje.
        var resultado = {
            entidadEncontrada: false
        };
        // El resultado es un diccionario ya que si lo ponemos como boolean se hace un paso por valor
        // y no por referencia que es lo que necesitamos ya que no he conseguido hacer un return que vuelva bien dentro de la función.
        moduloUtilidades.comprobarEntidad(session, builder, LuisModelUrl, 'saludar', resultado);

        // Añadimos un Timeout debido a que comprobar Entidad tarda unos milisegundos en devolver el resultado.
        setTimeout(function(){
            if (resultado.entidadEncontrada){
                // Inicializamos la variable de contador de saludos por conversación
                if(session.privateConversationData.contadorSaludos == undefined){
                    session.privateConversationData.contadorSaludos = 0;
                }
                session.beginDialog(moduloRutas.rutas["saludar"]);
                resultado.entidadEncontrada = false;
            } else {
                session.send(moduloTextos.espanol["sinRespuesta"]);
                if (session.userData.name == undefined || session.userData.name == null){
                    session.send(moduloTextos.espanol["primeraVez"]);
                }
                if (moduloUtilidades != undefined && moduloUtilidades != null){
                    moduloUtilidades.mostrarMensajeVisitaGuiada(session);
                }
                session.userData.ayuda++;
                session.endDialog();
            };
        }, 1500);
    }
);