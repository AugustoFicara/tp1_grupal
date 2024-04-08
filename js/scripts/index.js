let empresas = [];

async function cargarEmpresas() {
    // Hacemos un fetch a la ruta del server que se encarga de buscar la información que necesitamos
    const response = await fetch('/buscar-empresas');
    if (!response.ok) {
        throw new Error('Ocurrió un error al conseguir las empresas desde la db');
    }

    // Asignamos las empresas a un array global para no estar haciendo selects de más
    empresas = await response.json();
    // Buscamos la tabla en el html
    let tablaEmpresas = document.getElementById('empresas');
    // Limpiamos los posibles datos que tenga
    tablaEmpresas.innerHTML = '';

    // Data trae todo lo que le enviamos desde el servidor, en este caso información de las empresas.
    empresas.forEach(empresa => {
        let tr = document.createElement('tr');

        let tdNombre = document.createElement('td');
        let nombreEmpresa = document.createElement('b');
        nombreEmpresa.textContent = empresa.denominacion;

        tdNombre.appendChild(nombreEmpresa);

        let tdUrl = document.createElement('td');

        // Enviamos como parametros los datos de la empresa para plasmarlos en el html del home
        let url = document.createElement('a');
        url.textContent = 'Abrir página';
        url.id = empresa.id;
        // Le asignamos el id de la empresa para facilitar la búsqueda más adelante
        url.onclick = function () {
            almacenarDatos(this.id);
        }

        tdUrl.appendChild(url);

        tdEditar = document.createElement('td');
        let buttonEditar = document.createElement('button');
        buttonEditar.textContent = 'Editar';
        buttonEditar.id = empresa.id;
        buttonEditar.onclick = function () {
            cargarInputs(empresa.id);
        }

        tdEditar.appendChild(buttonEditar);

        tdEliminar = document.createElement('td');
        let buttonEliminar = document.createElement('button');
        buttonEliminar.textContent = 'Eliminar';
        buttonEliminar.id = empresa.denominacion;
        buttonEliminar.onclick = function () {
            eliminarEmpresa(this.id);
        }

        tdEliminar.appendChild(buttonEliminar);

        tr.appendChild(tdNombre);
        tr.appendChild(tdUrl);
        tr.appendChild(tdEditar);
        tr.appendChild(tdEliminar);

        tablaEmpresas.appendChild(tr);
    });
}

cargarEmpresas();


// Almacenar datos obtiene el id del <a> el cual se le asignó el id de cada empresa
function almacenarDatos(id) {
    // iteramos las empresas hasta obtener a la que se le hizo click
    empresas.forEach(empresa => {
        if (empresa.id === parseInt(id)) {
            localStorage.setItem('empresa', JSON.stringify(empresa));
        }
    });

    window.location.href = 'http://localhost:3000/home';
}