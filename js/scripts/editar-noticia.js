let empresas = [];

function actualizarNoticia() {

    var content = tinymce.get("editorHtml").getContent();

    var tempElement = document.createElement('div');
    tempElement.innerHTML = content;

    // Buscamos el h1 para el titulo
    var h1Elements = tempElement.querySelectorAll('h1');

    // Eliminamos el título del contenido
    if (h1Elements.length > 0) {
        h1Elements[0].remove();
    }

    // Obtener resumen del contenido sin incluir el título
    var textContent = tempElement.textContent.trim();
    var resumen = textContent.slice(0, 1000);

    // Si el resumen es mayor que 1000 caracteres, recortamos en el último espacio
    while (resumen.length > 1000) {
        resumen = resumen.slice(0, resumen.lastIndexOf(' '));
    }
    resumen = resumen.trim();

    const formData = new FormData();
    formData.append('titulo', h1Elements.length > 0 ? h1Elements[0].innerText : '');
    formData.append('resumen', resumen);


    // Agrego el html completo
    formData.append('contenidoHTML', content);

    // S publicada, N no publicada
    formData.append('publicada', 'S');

    // Parseamos la fecha al formato de mysql
    var fecha = new Date();

    // Obtener día, mes y año
    var dia = fecha.getDate().toString().padStart(2, '0');
    var mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    var año = fecha.getFullYear();

    // Formatear la fecha como YYYY-MM-DD
    var fechaFormateada = año + '-' + mes + '-' + dia;
    formData.append('fechaPublicacion', fechaFormateada);

    empresas.forEach(empresa => {
        var idEmpresa = document.getElementById('empresas').value;

        if (empresa.id === parseInt(idEmpresa)) {
            // Guardamos el id de la empresa
            formData.append('idEmpresa', empresa.id);
            // Guardamos el id de la empresa para las rutas
            formData.append('nombreEmpresa', empresa.nombre);

            var imagen = tempElement.querySelectorAll('img')[0];
            // Guardamos la imagen y su nombre( el de la empresa) para poder diferenciarlas
            const nuevoArchivo = new File([imagen], empresa.denominacion, { type: imagen.type });
            formData.append('imagen', nuevoArchivo);
            // Damos la ruta de donde va a estar cada imagen dependiendo la empresa que las carga
            formData.append('imagenSRC', './images/' + empresa.denominacion + '/' + empresa.denominacion);
        }
    });

    let noticia = JSON.parse(localStorage.getItem('noticia'));
    formData.append('idNoticia', noticia.id);

    fetch('/actualizar-noticia', {
        method: 'PUT',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Error al cargar la noticia');
            }
        })
        .then(data => {
            alert(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function cargarSelect() {
    try {
        // Hacemos un fetch a la ruta del server que se encarga de buscar la información que necesitamos
        const response = await fetch('/buscar-empresas');
        if (!response.ok) {
            throw new Error('Ocurrió un error al conseguir las empresas desde la db');
        }

        // Asignamos las empresas a un array global para no estar haciendo selects de más
        empresas = await response.json();

        // Buscamos los selects en el html
        let selectEmpresas = document.getElementById('empresas');

        // Limpiamos los posibles datos que tenga
        selectEmpresas.innerHTML = ''

        // Data trae todo lo que le enviamos desde el servidor, en este caso información de las empresas.
        empresas.forEach(empresa => {
            let nombreEmpresa = document.createElement('option');
            nombreEmpresa.textContent = empresa.denominacion;
            nombreEmpresa.value = empresa.id;

            selectEmpresas.appendChild(nombreEmpresa);
        });

        let storage = JSON.parse(localStorage.getItem('empresa'));
        if (storage) {
            selectEmpresas.value = storage.id;
        }
    } catch (error) {
        console.error(error.message);
    }
}

cargarSelect();


function borrarNoticia() {
    let noticia = JSON.parse(localStorage.getItem('noticia'));

    fetch('/eliminar-noticia/' + noticia.id , {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Error al cargar la noticia');
            }
        })
        .then(data => {
            alert(data);
            window.location.href = '/home';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

