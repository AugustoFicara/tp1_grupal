let noticias = [];

const empresaGuardada = JSON.parse(localStorage.getItem('empresa'));

document.addEventListener('DOMContentLoaded', function () {
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
});

async function cargarNoticias() {
    try {
        // Hacemos un fetch a la ruta del server que se encarga de buscar la información que necesitamos
        const response = await fetch('/buscar-noticias');
        if (!response.ok) {
            throw new Error('Ocurrió un error al conseguir las empresas desde la db');
        }

        // Asignamos las empresas a un array global para no estar haciendo selects de más
        noticias = await response.json();

        let contador = 0;

        noticias.forEach(noticia => {
            if (noticia.idEmpresa === empresaGuardada.id && parseInt(contador) < 5) {
                let divContenido = document.getElementById('contenido-' + contador);
                if (divContenido) {
                    let titulo = document.createElement('em');
                    titulo.textContent = noticia.titulo;

                    divContenido.appendChild(titulo);

                    let div = document.createElement('div');
                    div.className = 'wrap';

                    let p = document.createElement('p');
                    p.textContent = noticia.resumen;

                    div.appendChild(p);

                    divContenido.appendChild(div);

                    divContenido.id = noticia.id;
                    divContenido.onclick = function () {
                        mostrarNoticia(this.id);
                    }

                }
                contador++;
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