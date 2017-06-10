var moduloTextos = require("../textos/textos.js")
var moduloRutas = require("../textos/rutasDialogos.js")

exports.saludar = function saludarHoraDía(session) {
    var date = new Date();
    if (date.getHours() > 7 && date.getHours() < 14){
        session.send(moduloTextos.espanol["saludo"]["dia"]);
    } else if (date.getHours() >= 14 && date.getHours() < 20){
        session.send(moduloTextos.espanol["saludo"]["tarde"]);
    } else {
        session.send(moduloTextos.espanol["saludo"]["noche"]);
    }
};

exports.getNombre = function getNombre(session){
    session.send(moduloTextos.espanol["presentacion"]);
    session.beginDialog(moduloRutas.rutas["obtenerNombre"]);
}

exports.mostrarMensajeVisitaGuiada = function visitaGuiada(session){
    if (session.userData.ayuda >= 3){
        session.send(moduloTextos.espanol["visitaGuiada"]["mensajeAyuda"]);
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

exports.montarOpcionesPorValor = function montarOpciones(json){
    var opciones = []
    for (var i in json){
        opciones.push(json[i])
    }
    opciones.push(moduloTextos.model["pararVisita"]);
    return opciones;
};

exports.montarOpcionesPorClave = function montarOpciones(json){
    var opciones = []
    for (var i in json){
        opciones.push(i)
    }
    opciones.push("pararVisita");
    return opciones;
}