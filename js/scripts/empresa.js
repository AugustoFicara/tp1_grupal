function cargarEmpresa() {
    let tablaEmpresas = document.getElementById('tabla-empresas');
    tablaEmpresas.style.display = 'none';

    let formAgregar = document.getElementById('formAgregarEmpresa');
    formAgregar.style.display = 'block';
    document.getElementById('agregar').style.display = 'none';

    let nombre = document.getElementById('nombre');
    let telefono = document.getElementById('telefono');
    let horario = document.getElementById('horario');
    let quienesSon = document.getElementById('nosotros');
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
                cargarEmpresas();
                alert(text);
                limpiarInputs();
                empresasDiv.style.display = 'block';
                formAgregar.style.display = 'none';
            })
            .catch(error => {
                console.error(error)
            });
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

async function actualizarEmpresa(id) {
    let nombre = document.getElementById('nombre-editar');
    let telefono = document.getElementById('telefono-editar');
    let horario = document.getElementById('horario-editar');
    let quienesSon = document.getElementById('nosotros-editar');
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
                cargarEmpresas();
                alert(text);
                limpiarInputs();
                empresasDiv.style.display = 'block';
                formActualizar.style.display = 'none';
            })
            .catch(error => {
                console.error(error)
            });
    } else {
        alert("Completar todos los campos");
    }
}

async function eliminarEmpresa(nombre) {
    try {
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
                puedeEliminarse = false;
            }
        });

        if (puedeEliminarse) {
            await fetch('/eliminar-empresa/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error('Error al actualizar la empresa');
                    }
                })
                .then(text => {
                    cargarEmpresas();
                    alert(text);
                    limpiarInputs();
                })
                .catch(error => {
                    console.error(error)
                });
        } else {
            alert("No se puede eliminar una empresa que tiene noticias relacionadas");
        }
    } catch (error) {
        console.error(error);
    }
}

function cargarInputs(id) {
    document.getElementById('agregar').style.display = 'none';

    let tablaEmpresas = document.getElementById('tabla-empresas');
    tablaEmpresas.style.display = 'none';

    let formActualizar = document.getElementById('formActualizarEmpresa');
    formActualizar.style.display = 'block';

    empresas.forEach(empresa => {
        if (parseInt(id) === empresa.id) {
            console.log(empresa)
            let telefono = document.getElementById('telefono-editar');
            let horarioInicio = document.getElementById('inicioHorario-editar');
            let horarioFin = document.getElementById('finHorario-editar');
            let quienesSon = document.getElementById('nosotros-editar');
            let latitud = document.getElementById('latitud-editar');
            let longitud = document.getElementById('longitud-editar');
            let domicilio = document.getElementById('domicilio-editar');
            let email = document.getElementById('email-editar');
            let nombre = document.getElementById('nombre-editar');

            nombre.textContent = empresa.denominacion;
            nombre.value = empresa.denominacion;

            telefono.textContent = empresa.telefono;
            telefono.value = empresa.telefono;

            horarioInicio.textContent = empresa.horarioAtencion;
            horarioInicio.value = empresa.horarioAtencion;

            horarioFin.textContent = empresa.horarioAtencion;
            horarioFin.value = empresa.horarioAtencion;

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

function mostrarAgregar() {
    document.getElementById('tabla-empresas').style.display = 'none';
    document.getElementById('agregar').style.display = 'none';
    document.getElementById('formAgregarEmpresa').style.display = 'block';
}

function limpiarInputs() {
    let inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.textContent = '';
        input.value = '';
    });
}

function mostrarTabla() {
    document.getElementById('tabla-empresas').style.display = 'flex';
    document.getElementById('agregar').style.display = 'block';
    document.getElementById('formAgregarEmpresa').style.display = 'none';
    document.getElementById('formActualizarEmpresa').style.display = 'none';

}