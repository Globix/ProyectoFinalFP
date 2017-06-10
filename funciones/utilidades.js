var textos = require("../textos/textos.js")

exports.saludar = function saludarHoraDía(session) {
    var date = new Date();
    if (date.getHours() > 7 && date.getHours() < 14){
        session.send(textos.diccionario["saludo"]["dia"]);
    } else if (date.getHours() >= 14 && date.getHours() < 20){
        session.send(textos.diccionario["saludo"]["tarde"]);
    } else {
        session.send(textos.diccionario["saludo"]["noche"]);
    }
};

exports.mostrarMensajeVisitaGuiada = function visitaGuiada(session){
    if (session.userData.ayuda >= 3){
        session.send(textos.diccionario["visitaGuiada"]);
        session.userData.ayuda = 0;
    }
};

exports.comprobarEntidad = function comprobarEntidad(session, builder, LuisModelUrl, modeloEntidad, resultado) {
    var entidadEncontrada;
    builder.LuisRecognizer.recognize(session.message.text, LuisModelUrl, function(err, intents, entities){
        entidadEncontrada = builder.EntityRecognizer.findEntity(entities, modeloEntidad);
        if(entidadEncontrada.type == modeloEntidad){
            resultado.entidadEncontrada = true;
        };
    });
};