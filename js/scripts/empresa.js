function cargarEmpresa() {
    let tablaEmpresas = document.getElementById('tabla-empresas');
    tablaEmpresas.style.display = 'none';

    let formAgregar = document.getElementById('formAgregarEmpresa');
    formAgregar.style.display = 'block';

    document.getElementById('agregar').style.display = 'none';

    let nombre = document.getElementById('nombre');
    let telefono = document.getElementById('telefono');
    let horarioApertura = document.getElementById('inicioHorario');
    let horarioCierre = document.getElementById('finHorario');
    let quienesSon = document.getElementById('nosotros');
    let latitud = document.getElementById('latitud');
    let longitud = document.getElementById('longitud');
    let domicilio = document.getElementById('domicilio');
    let email = document.getElementById('email');

    if (nombre.value && telefono.value && horarioApertura.value && horarioCierre.value && quienesSon.value && latitud.value && longitud.value && domicilio.value && email.value) {
        let empresa = {
            nombre: nombre.value,
            telefono: telefono.value,
            horario: `Lunes a viernes de ${horarioApertura.value} hasta ${horarioCierre.value}`,
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
            })
            .catch(error => {
                console.error(error)
            });
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

async function actualizarEmpresa() {
    let id = document.getElementById('id-editar').value;
    let nombre = document.getElementById('nombre-editar');
    let telefono = document.getElementById('telefono-editar');
    let horarioApertura = document.getElementById('inicioHorario-editar');
    let horarioCierre = document.getElementById('finHorario-editar');
    let quienesSon = document.getElementById('nosotros-editar');
    let latitud = document.getElementById('latitud-editar');
    let longitud = document.getElementById('longitud-editar');
    let domicilio = document.getElementById('domicilio-editar');
    let email = document.getElementById('email-editar');

    if (nombre.value && telefono.value && horarioApertura.value && horarioCierre.value && quienesSon.value && latitud.value && longitud.value && domicilio.value && email.value) {
        let empresa = {
            denominacion: nombre.value,
            telefono: telefono.value,
            horario: `Lunes a viernes de ${horarioApertura.value} hasta ${horarioCierre.value}`,
            quienesSon: quienesSon.value,
            latitud: latitud.value,
            longitud: longitud.value,
            domicilio: domicilio.value,
            email: email.value
        }

        fetch('/actualizar-empresa/' + parseInt(id), {
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
                mostrarTabla();

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
            let id = document.getElementById('id-editar');
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

            id.value = empresa.id;

            telefono.textContent = empresa.telefono;
            telefono.value = empresa.telefono;

            // (\d{2}:\d{2}) = \d{2} coincide con dos números consecutivos, : coincide con el carácter de dos puntos y \d{2} o sea dos numeros seguidos por dos puntos y otros dos números
            // s+ (Espacio en blanco)
            // (?=hasta) Si o si el texto debe estar antes de un hasta
            var horaInicioRegex = /(\d{2}:\d{2})\s+(?=hasta)/;
            var horaFinRegex = /(\d{2}:\d{2})$/;

            var horaInicioMatch = empresa.horarioAtencion.match(horaInicioRegex);
            var horaFinMatch = empresa.horarioAtencion.match(horaFinRegex);

            horarioInicio.textContent = horaInicioMatch[1];
            horarioInicio.value = horaInicioMatch[1];

            horarioFin.textContent = horaFinMatch[1];
            horarioFin.value = horaFinMatch[1];

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