let empresas = [];

function cargarEmpresa() {
    let nombre = document.getElementById('nombre');
    let telefono = document.getElementById('telefono');
    let horario = document.getElementById('horario');
    let quienesSon = document.getElementById('quienesSon');
    let latitud = document.getElementById('latitud');
    let longitud = document.getElementById('longitud');
    let domicilio = document.getElementById('domicilio');
    let email = document.getElementById('email');

    if (nombre.value && telefono.value && horario.value && quienesSon.value && latitud.value && longitud.value && domicilio.value && email.value) {
        let empresa = {
            nombre: nombre.value,
            telefono: telefono.value,
            horario: horario.value,
            quienesSon: quienesSon.value,
            latitud: latitud.value,
            longitud: longitud.value,
            domicilio: domicilio.value,
            email: email.value
        }

        fetch('/cargar-empresa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(empresa),
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Error al actualizar la empresa');
                }
            })
            .then(text => {
                alert(text);
                cargarSelect();
                limpiarInputs();
            })
            .catch(error => {
                console.error(error)
            });
    } else {
        alert('Por favor, complete todos los campos.');
    }


}

function actualizarEmpresa() {
    let id = document.getElementById('id-editar').value;
    let nombre = document.getElementById('empresa-editar');
    let telefono = document.getElementById('telefono-editar');
    let horario = document.getElementById('horario-editar');
    let quienesSon = document.getElementById('quienesSon-editar');
    let latitud = document.getElementById('latitud-editar');
    let longitud = document.getElementById('longitud-editar');
    let domicilio = document.getElementById('domicilio-editar');
    let email = document.getElementById('email-editar');

    if (nombre.value && telefono.value && horario.value && quienesSon.value && latitud.value && longitud.value && domicilio.value && email.value) {
        let empresa = {
            denominacion: nombre.value,
            telefono: telefono.value,
            horario: horario.value,
            quienesSon: quienesSon.value,
            latitud: latitud.value,
            longitud: longitud.value,
            domicilio: domicilio.value,
            email: email.value
        }

        fetch('/actualizar-empresa/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(empresa),
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Error al actualizar la empresa');
                }
            })
            .then(text => {
                alert(text);
                cargarSelect();
                limpiarInputs();
            })
            .catch(error => {
                console.error(error)
            });
    } else {
        alert("Completar todos los campos");
    }
}

async function eliminarEmpresa() {
    try {
        let nombre = document.getElementById('empresa-eliminar').value;
        let id = null;

        empresas.forEach(empresa => {
            if (empresa.denominacion === nombre) {
                id = empresa.id;
            }
        });

        const response = await fetch('/buscar-noticias');
        if (!response.ok) {
            throw new Error('Ocurrió un error al conseguir las noticias desde la base de datos');
        }

        const noticias = await response.json();

        var puedeEliminarse = true;

        noticias.forEach(noticia => {
            if (parseInt(noticia.idEmpresa) === parseInt(id)) {
                alert("No se puede eliminar una empresa que tiene noticias relacionadas");
                puedeEliminarse = false;
            }
        });

        if (puedeEliminarse) {
            const deleteResponse = await fetch('/eliminar-empresa/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!deleteResponse.ok) {
                throw new Error('Error al eliminar la empresa');
            }

            const text = await deleteResponse.text();
            alert(text);
            cargarSelect();
            limpiarInputs();
        }
    } catch (error) {
        console.error(error);
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
        let selectEditar = document.getElementById('empresa-editar');
        let selectEliminar = document.getElementById('empresa-eliminar');

        // Limpiamos los posibles datos que tenga
        selectEditar.innerHTML = '';
        selectEliminar.innerHTML = '';

        // Data trae todo lo que le enviamos desde el servidor, en este caso información de las empresas.
        empresas.forEach(empresa => {
            let nombreEmpresa = document.createElement('option');
            nombreEmpresa.textContent = empresa.denominacion;
            nombreEmpresa.value = empresa.denominacion;

            selectEditar.appendChild(nombreEmpresa);
        });

        empresas.forEach(empresa => {
            let nombreEmpresa = document.createElement('option');
            nombreEmpresa.textContent = empresa.denominacion;
            nombreEmpresa.value = empresa.denominacion;

            selectEliminar.appendChild(nombreEmpresa);
        });

    } catch (error) {
        console.error(error.message);
    }
}

cargarSelect();

function cargarInputs() {
    let selectElegido = document.getElementById('empresa-editar').value;

    empresas.forEach(empresa => {
        if (selectElegido === empresa.denominacion) {
            let id = document.getElementById('id-editar');
            let telefono = document.getElementById('telefono-editar');
            let horario = document.getElementById('horario-editar');
            let quienesSon = document.getElementById('quienesSon-editar');
            let latitud = document.getElementById('latitud-editar');
            let longitud = document.getElementById('longitud-editar');
            let domicilio = document.getElementById('domicilio-editar');
            let email = document.getElementById('email-editar');

            id.textContent = empresa.id;
            id.value = empresa.id;

            telefono.textContent = empresa.telefono;
            telefono.value = empresa.telefono;

            horario.textContent = empresa.horarioAtencion;
            horario.value = empresa.horarioAtencion;

            latitud.textContent = empresa.latitud;
            latitud.value = empresa.latitud;

            quienesSon.textContent = empresa.quienesSomos;
            quienesSon.value = empresa.quienesSomos;

            longitud.textContent = empresa.longitud;
            longitud.value = empresa.longitud;

            domicilio.textContent = empresa.domicilio;
            domicilio.value = empresa.domicilio;

            email.textContent = empresa.email;
            email.value = empresa.email;
        }
    });
}

function limpiarInputs() {
    let inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.textContent = '';
        input.value = '';
    });
}