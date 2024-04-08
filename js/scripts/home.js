let noticias = [];

const empresaGuardada = JSON.parse(localStorage.getItem('empresa'));

let telefono = document.getElementById('telefono');
telefono.textContent = empresaGuardada.telefono;

let nombre = document.getElementById('nombre');
nombre.textContent = empresaGuardada.denominacion;

let nombreF = document.getElementById('nombre-footer');
nombreF.textContent = empresaGuardada.denominacion;

let quienes = document.getElementById('quienes-somos');
quienes.textContent = empresaGuardada.quienesSomos;

let horario = document.getElementById('horario');
horario.textContent = 'Horario: ' + empresaGuardada.horarioAtencion;

let mapa = document.getElementById('mapa');
mapa.src = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11270.125646913215!2d${empresaGuardada.latitud}!3d${empresaGuardada.longitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1615335513448!5m2!1ses-419!2sar`;
;
async function cargarNoticias() {
    try {
        // Hacemos un fetch a la ruta del server que se encarga de buscar la información que necesitamos
        const response = await fetch('/buscar-noticias');
        if (!response.ok) {
            throw new Error('Ocurrió un error al conseguir las empresas desde la db');
        }

        // Asignamos las empresas a un array global para no estar haciendo selects de más
        noticias = await response.json();

        // Data trae todo lo que le enviamos desde el servidor, en este caso información de las empresas.
        let noticiasDiv = document.getElementById('noticias');

        noticias.forEach(noticia => {
            if (noticia.idEmpresa === empresaGuardada.id) {
                try {
                    let divCentral = document.createElement('div');
                    divCentral.id = noticia.id;
                    divCentral.onclick = function () {
                        mostrarNoticia(this.id);
                    }
                    let img = document.createElement('img');
                    img.src = noticia.imagenSRC;

                    let div = document.createElement('div');
                    div.className = 'titulo-resumen';

                    let titulo = document.createElement('a');
                    titulo.textContent = noticia.titulo;

                    div.appendChild(titulo);

                    let p = document.createElement('p');
                    p.textContent = noticia.resumen;

                    div.appendChild(p);

                    if(img)divCentral.appendChild(img);
                    
                    divCentral.appendChild(div);

                    noticiasDiv.appendChild(divCentral);

                } catch (e) {

                }

            }


        });

    } catch (error) {
        console.error(error.message);
    }
}

function mostrarNoticia(id) {
    noticias.forEach(noticia => {
        if (noticia.id === parseInt(id)) {
            localStorage.setItem('noticia', JSON.stringify(noticia));

            window.location.href = '/detalle'
        }
    });
}

cargarNoticias();