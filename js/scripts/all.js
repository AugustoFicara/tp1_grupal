var allImg = new Array();

async function cargarCosas() {
    try {
        // Hacemos un fetch a la ruta del server que se encarga de buscar la información que necesitamos
        const response = await fetch('/buscar-noticias');
        if (!response.ok) {
            throw new Error('Ocurrió un error al conseguir las empresas desde la db');
        }

        // Asignamos las empresas a un array global para no estar haciendo selects de más
        noticias = await response.json();

        let contador = 1;

        noticias.forEach(noticia => {
            if (contador < 6 && noticia.imagenSRC) {
                // Con el contador vamos recuperando los divs en los cuales queremos colocar la imagen de fondo
                let img = document.getElementById('src-contenido-' + contador);
                img.setAttribute('data-src', noticia.imagenSRC);
                // Asignamos la ruta de la imagen al array que se itera en el slider
                allImg.push(noticia.imagenSRC);
            }
            contador++;
        });
    } catch (error) {
        console.error("Error" + error.message);
    }
}

cargarCosas();