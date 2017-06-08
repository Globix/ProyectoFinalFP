var textos = require("../textos/textos.js")

exports.saludar = function saludarHoraDía(session) {
    var date = new Date();
    if (date.getHours() > 7 && date.getHours() < 14){
        session.send(textos.diccionario["saludoManyana"]);
    } else if (date.getHours() >= 14 && date.getHours() < 20){
        session.send(textos.diccionario["saludoTarde"]);
    } else {
        session.send(textos.diccionario["saludoNoche"]);
    }
}

exports.mostrarMensajeVisitaGuiada = function visitaGuiada(session){
    console.log("prueba " + session.userData.ayuda);
    if (session.userData.ayuda >= 3){
        session.send(textos.diccionario["visitaGuiada"]);
        session.userData.ayuda = 0;
    }
}