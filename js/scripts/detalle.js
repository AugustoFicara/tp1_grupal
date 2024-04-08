const empresaGuardada = JSON.parse(localStorage.getItem('empresa'));

let telefono = document.getElementById('telefono');
telefono.textContent = empresaGuardada.telefono;

let nombre = document.getElementById('nombre');
nombre.textContent = empresaGuardada.denominacion;

let nombreF = document.getElementById('nombre-footer');
nombreF.textContent = empresaGuardada.denominacion;

let horario = document.getElementById('horario');
horario.textContent = 'Horario: ' + empresaGuardada.horarioAtencion;


async function cargarNoticias() {
    try {
        // Data trae todo lo que le enviamos desde el servidor, en este caso información de las empresas.
        let noticiasDiv = document.getElementById('noticias');

        let noticia = JSON.parse(localStorage.getItem('noticia'));
        try {
            let divCentral = document.createElement('div');
            divCentral.id = noticia.id;
            divCentral.onclick = function () {
                mostrarNoticia(this.id);
            }
            let img = document.getElementById('imagenPrincipal');
            img.src = noticia.imagenSRC;

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

            divCentral.appendChild(div);

            noticiasDiv.appendChild(divCentral);

        } catch (e) {

        }

    } catch (error) {
        console.error(error.message);
    }
}

cargarNoticias();