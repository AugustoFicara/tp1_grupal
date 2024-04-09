var allImg = new Array();

async function cargarCosas() {
    try {
        const empresaGuardada = JSON.parse(localStorage.getItem('empresa'));
        // Hacemos un fetch a la ruta del server que se encarga de buscar la información que necesitamos
        const response = await fetch('/buscar-noticias');
        if (!response.ok) {
            throw new Error('Ocurrió un error al conseguir las empresas desde la db');
        }

        // Asignamos las empresas a un array global para no estar haciendo selects de más
        noticias = await response.json();

        let contador = 1;

        noticias.forEach(noticia => {
            if (contador < 6 && noticia.imagenSRC && parseInt(noticia.idEmpresa) === parseInt(empresaGuardada.id)) {
                // Con el contador vamos recuperando los divs en los cuales queremos colocar la imagen de fondo
                let img = document.getElementById('src-contenido-' + contador);
                img.setAttribute('data-src', noticia.imagenSRC);
                // Asignamos la ruta de la imagen al array que se itera en el slider
                allImg.push(noticia.imagenSRC);
            }
            contador++;
        });

        // Si la empresa no tiene ninguna imagen, es decir, no hay ninguna noticia asociada. Entonces ocultamos el slider
        if(allImg.length === 0) {
            document.getElementById('section-noticias').style.display = 'none';
        }
    } catch (error) {
        console.error("Error" + error.message);
    }
}

cargarCosas();