const empresaGuardada = JSON.parse(localStorage.getItem('empresa'));

let telefono = document.getElementById('telefono');
telefono.textContent = empresaGuardada.telefono;

let nombre = document.getElementById('nombre');
nombre.textContent = empresaGuardada.denominacion;

let nombreF = document.getElementById('nombre-footer');
nombreF.textContent = empresaGuardada.denominacion;

let horario = document.getElementById('horario');
horario.textContent = 'Horario: ' + empresaGuardada.horarioAtencion;


async function cargarNoticia() {
    try {
        // Data trae todo lo que le enviamos desde el servidor, en este caso información de las empresas.
        let noticia = JSON.parse(localStorage.getItem('noticia'));
        try {
            let img = document.getElementById('imagenPrincipal');
            img.style.backgroundImage = 'url(' + noticia.imagenSRC + ')';

            let titulo1 = document.getElementById('titulo1');
            titulo1.textContent = noticia.titulo;

            let titulo2 = document.getElementById('titulo2');
            titulo2.textContent = noticia.titulo;

            let resumen = document.getElementById('resumen');
            resumen.textContent = noticia.resumen;

            let fechaPublicacion = document.getElementById('fecha');
            fechaPublicacion.textContent = noticia.fechaPublicacion;

            let contenidoHTML = document.getElementById('contenidoHTML');
            contenidoHTML.textContent = noticia.contenidoHTML;

        } catch (e) {

        }

    } catch (error) {
        console.error(error.message);
    }
}

cargarNoticia();