let empresas = [];

function actualizarNoticia() {
    const formData = new FormData();

    var permitirCarga = true;

    var content = tinymce.get("editorHtml").getContent();

    // Agrego el html completo
    formData.append('contenidoHTML', content);

    // Buscamos el h1 para el titulo
    var titulo = document.getElementById('titulo-noticia').value;

    if (titulo) {
        formData.append('titulo', titulo);
    } else {
        alert('Falta un titulo');
        permitirCarga = false;
    }

    // Buscamos todos los divs
    var tempElement = document.createElement('div');
    tempElement.innerHTML = content;

    // Obtener resumen del contenido sin incluir el título
    var textContent = tempElement.textContent.trim();
    var resumen = textContent.slice(0, 1000);

    // Si el resumen es mayor que 1000 caracteres, recortamos en el último espacio
    while (resumen.length > 1000) {
        resumen = resumen.slice(0, resumen.lastIndexOf(' '));
    }    
    resumen = resumen.trim();
    formData.append('resumen', resumen);

    // S publicada, N no publicada
    formData.append('publicada', 'S');

    var fecha = document.getElementById('fecha-noticia').value;

    if(fecha){
        formData.append('fechaPublicacion', fecha);
    } else {
        alert('Falta una fecha');
        permitirCarga = false;
    }

    empresas.forEach(empresa => {
        var idEmpresa = document.getElementById('empresas').value;

        if (empresa.id === parseInt(idEmpresa)) {
            // Guardamos el id de la empresa
            formData.append('idEmpresa', empresa.id);
            // Guardamos el id de la empresa para las rutas
            formData.append('nombreEmpresa', empresa.denominacion);

            var imagen = document.getElementById('imagen-noticia').files[0];

            if (imagen) {
                var file = new File([imagen], parseInt(Math.random() * 250000), { type: imagen.type });
                // Cargamos la imagen en el server
                formData.append('imagen', file);
                // Enviamos la ruta de la imagen a la base de datos
                formData.append('imagenSRC', './images/' + empresa.denominacion + '/' + file.name);
            } else {
                alert("Falta una imagen");
                permitirCarga = false;
            }

        }
    });

    let noticia = JSON.parse(localStorage.getItem('noticia'));
    formData.append('idNoticia', noticia.id);

    if (permitirCarga) {
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
                window.location.href = '/home';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


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

    fetch('/eliminar-noticia/' + noticia.id, {
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

