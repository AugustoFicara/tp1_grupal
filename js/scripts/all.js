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

            if (contador < 6) {

                let img = document.getElementById('src-contenido-' + contador);
                img.setAttribute('data-src', './images/page-1_img' + contador + '.jpg');
                //img.setAttribute('data-src', noticia.imagen);

                //allImg.push('./images/prueba.jpg');

                contador++;
            }

        });
    } catch (error) {
        console.error(error.message);
    }
}

cargarCosas();