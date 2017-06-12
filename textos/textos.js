exports.espanol = {
    estadoAnimo: {
        bot: "Yo bien, gracias por preguntar",
        alegre: "¡Me alegro mucho por ti!",
        enfadado: "Seguro que todo tiene una explicación y mejora, ¡Ánimo!",
        porDefecto: "Lo siento, pero no estoy entrenado para comprender este tipo de sentimiento, pero ¡Ánimo!",
        pregunta: "¿Tu que tal estas?",
        triste: "¡Ánimo, seguro que todo mejora pronto!",
    },
    gracias: "De acuerdo, si necesitas algo, aqui estoy",
    informacionEnlaces: "Puedes encontrar información de los siguientes términos en los siguientes enlaces:",
    informacionOpcionMenu: {
        estudiante: {
            comoAcceder: "Insertar aqui información sobre 'como acceder'",
            comoFunciona: "Insertar aqui información sobre 'como funciona'",
            dondeTrabajaras: "Insertar aqui información sobre 'donde trabajaras'",
            deQueTrabajaras: "Insertar aqui información sobre 'de qué trabajaras'"
        },
        empresa: {
            guiaDeContratacion: "Insertar aqui información sobre 'guia de contratación'",
            experiencias: "Insertar aqui información sobre 'experiencias'",
            quePerfilesOfrecemos: "Insertar aqui información sobre 'que perfiles ofrecemos'"
        }
    },
    informacionNoDisponible: "Información no disponible en el fichero de textos",
    nombreGuardado: "De acuerdo, a partir de ahora me dirigiré a ti como ", // + Nombre usuario
    preguntaAyuda: "¿En que puedo ayudarte?",
    preguntaMasAyuda: "¿En que otra cosa puedo ayudarte?",
    preguntaNombre: "Antes de nada ¿Cómo debería dirigirme a ti?",
    presentacion: "Soy BADAW el asistente creado para la guia a través de la página web del curso de Formación Profesional Dual en Desarrollo de Aplicaciones Web.",
    primeraVez: "Si es tu primera vez, ¡Prueba a empezar saludandome!",
    retomarEnrutado: "Gracias, procedo ahora a analizar tu información",
    saludo: {
        dia: "¡Buenos días!",
        noche: "¡Buenas noches!",
        tarde: "¡Buenas tardes!"
    },
    listaSaludos: {
        0: "Hola de nuevo ",// + Nombre usuario
        1: "Si, ya me has saludado, hola.",
        2: "Disculpa, ¿Me estás vacilando?",
        3: "Me estas empezando a tocar las narices.",
        4: "Mira, te juro que yo tengo paciencia, pero también tengo un limite, para por favor.",
        5: "Okey, se acabó la discusión, no mas respuestas.",
        6: "ERROR 404: NOT RESPUESTA FOUND FOR " // + Nombre usuario
    },
    sinRespuesta: "Lo siento, pero no tengo respuesta para eso ¿Puedes volver a intentarlo?",
    visitaGuiada: {
        inicio: "¡De acuerdo! Empecemos pues, si estás en el menú principal tienes 2 opciones, o bien ver un resumen de lo que vas a encontrar en nuestra página, o bien acceder al apartado de ", // + Estatus usuario
        mensajeAyuda: "Si estas perdido puedes hacer uso de la visita guiada, tan solo dí 'Visita guiada'.",
        menu: "¡Muy bien! Ahora te encuentras en el menú y tienes las siguientes opciones disponibles, pulsa en cualquier de ellas para obtener más información de lo que puedes encontrar.",
        opciones: "Iniciando visita guiada, ¿Deseas la versión de Estudiante o la de Empresa?",
        resumen: "Si bajas la página web hacia abajo podrás encontrar información sobre ", // + Opciones (Habria que cambiar esto porque ahora estan a "piñon" cableados en la logica
        parar: "Como ordenes, parando visita guiada.",
    },
}
exports.model = {
    pararVisita: "Parar visita guiada",
    estudiante: "Estudiante",
    empresa: "Empresa",
    opcionesIndice: {
        resumen: "Resumen",
        menu: "Menu",
    },
    opcionesMenu: {
        estudiante: {
            comoAcceder: "Como acceder",
            comoFunciona: "¿Como funciona?",
            dondeTrabajaras: "¿Donde trabajaras?",
            deQueTrabajaras: "¿De qué trabajaras?",
        },
        empresa: {
            guiaDeContratacion: "Guia de contratación",
            experiencias: "Experiencias",
            quePerfilesOfrecemos: "Que perfiles ofrecemos",
        }
    },
    resumen: {
        quienesSomos: "¿Quiénes somos?",
        queHacemos: "¿Qué hacemos?",
        comoLoHacemos: "¿Cómo lo hacemos?"
    },
    volver: "Volver",
    visitaGuiada: "Visita guiada",
    siguiente: "Siguiente"

}
