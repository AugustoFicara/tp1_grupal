let noticias = [];

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
        // Hacemos un fetch a la ruta del server que se encarga de buscar la información que necesitamos
        const response = await fetch('/buscar-noticias');
        if (!response.ok) {
            throw new Error('Ocurrió un error al conseguir las empresas desde la db');
        }

        // Asignamos las empresas a un array global para no estar haciendo selects de más
        noticias = await response.json();

        // Data trae todo lo que le enviamos desde el servidor, en este caso información de las empresas.
        let noticiasDiv = document.getElementById('noticias');
        noticiasDiv.innerHTML = '';

        noticias.forEach(noticia => {
            crearTablaConNoticia(noticiasDiv, noticia);
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

function filtrarNoticias() {
    let palabraBuscada = document.getElementById('inputFiltro').value;
    console.log()

    let noticiasDiv = document.getElementById('noticias');
    noticiasDiv.innerHTML = '';

    noticias.forEach(noticia => {
        if (noticia.titulo.includes(palabraBuscada) || noticia.resumen.includes(palabraBuscada)) {
            crearTablaConNoticia(noticiasDiv, noticia);
        }
    });
}


function crearTablaConNoticia(noticiasDiv, noticia) {
    // Creo la tabla
    let table = document.createElement('table');
    table.style = 'width: 90%; align: center';

    let tbody = document.createElement('tbody');

    let tr = document.createElement('tr');

    let td = document.createElement('td');

    // Creo el a que contiene la img
    let imgContainer = document.createElement('a');

    // Creo la img con la clase, la ruta y 250px de ancho
    let img = document.createElement('img');
    img.className = 'imgNoticia';
    img.src = noticia.imagenSRC;
    img.style.width = '250px';

    // Asigno la img al contenedor
    imgContainer.appendChild(img);

    // Asigno el contenedor al td
    td.appendChild(imgContainer);

    // Asigno el td al tr
    tr.appendChild(td);

    // Agrego el td que contiene toda la noticia
    let tdNoticia = document.createElement('td');
    tdNoticia.style = 'text-align: justify';
    tdNoticia.vAlign = 'top';

    // Creo el a con el titulo de la noticia
    let tituloNoticia = document.createElement('a');
    tituloNoticia.style = 'text-align: justify; font-size: 20px';
    tituloNoticia.href = '/detalle';
    tituloNoticia.className = 'banner';
    tituloNoticia.textContent = noticia.titulo;

    // Agrego el titulo al td de la noticia
    tdNoticia.appendChild(tituloNoticia);

    // Creo el div con el resumen de la noticia y el a hacia la noticia, más la fecha.
    let divResumen = document.createElement('div');
    divResumen.className = 'verOcultar';
    divResumen.textContent = noticia.resumen;

    // Creo el a
    let leerMas = document.createElement('a');
    leerMas.style = 'color: blue';
    leerMas.href = '/detalle';
    leerMas.textContent = 'Leer más - ' + noticia.fechaPublicacion;

    // Agrego dos br para colocar un salto de línea entre el resumen y el leer más
    divResumen.appendChild(document.createElement('br'));
    divResumen.appendChild(document.createElement('br'));

    // Asigno el leer mas con la fecha al div del resumen
    divResumen.appendChild(leerMas);

    // Asigno el resumen al td
    tdNoticia.appendChild(divResumen);

    // Agrego el td al tr principal
    tr.appendChild(tdNoticia);

    // Agrego el tr al body
    tbody.appendChild(tr);

    // Agrego el body a la tabla
    table.appendChild(tbody);

    // Coloco una línea debajo de cada noticia para mejorar la legibilidad
    table.appendChild(document.createElement('hr'));

    // Agrego la tabla al div principal
    noticiasDiv.appendChild(table);

    // Repito este proceso por cada noticia cargada
}