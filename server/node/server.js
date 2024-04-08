const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const mysql = require('mysql');
const multer = require('multer');
const fs = require('fs');



app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../../"));
app.use(cors());

// Creamos las rutas hacias los diferentes html

// __dirname es la ruta actual donde nos encontramos: /TEMPLATE_HTML/server/node/server.js
// Para poder acceder a los index debemos navegar hacia la ruta de cada uno: /TEMPLATE_HTML/index.html

// Por lo tanto cada ".." es volver una carpeta hacia atras
// __dirname/../ => /TEMPLATE_HTML/server/
// __dirname/../../ => /TEMPLATE_HTML/

app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "..", "adminEmpresa.html"));
});

app.get("/home", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "..", "home.html"));
});


app.get("/buscador", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "..", "buscador.html"));
});

app.get("/noticia", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "..", "tiny.html"));
});

app.get("/empresa", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "..", "empresa.html"));
});

app.get("/tiny-editar", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "..", "tinyEdit.html"));
});

app.get("/detalle", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "..", "detalle.html"));
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234567qQ@',
    database: 'tp1_grupal_lab4'
});

// Conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});


// Endpoint para buscar empresas en la base de datos
app.get('/buscar-empresas', (req, res) => {
    try {
        // Hcemos el callback hacia la db
        db.query("SELECT * FROM empresa", function (err, result) {
            if (err) {
                console.error('Error al buscar datos:', err);
                res.status(500).send('Error al obtener datos de la base de datos');
                return;
            }
            // Crear un objeto JSON a partir de los resultados
            const empresas = result.map(row => {
                return {
                    id: row.id,
                    denominacion: row.denominacion,
                    telefono: row.telefono,
                    horarioAtencion: row.horarioAtencion,
                    quienesSomos: row.quienesSomos,
                    latitud: row.latitud,
                    longitud: row.longitud,
                    domicilio: row.domicilio,
                    email: row.email
                };
            });
            // Enviar el objeto JSON como respuesta
            return res.json(empresas);
        });
    } catch (error) {
        console.error('Error al buscar datos:', error);
        res.status(500).send('Error al obtener datos de la base de datos');
    }
});

app.put('/actualizar-empresa/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const { denominacion, telefono, horario, quienesSon, latitud, longitud, domicilio, email } = req.body;

        const sql = `UPDATE empresa SET denominacion = ?, telefono = ?, horarioAtencion = ?, quienesSomos = ?, latitud = ?, longitud = ?, domicilio = ?, email = ? WHERE id = ?`;

        await db.query(sql, [denominacion, telefono, horario, quienesSon, latitud, longitud, domicilio, email, id]);

        res.send('Empresa actualizada correctamente');
    } catch (error) {
        console.error('Error al actualizar empresa:', error);
        res.status(500).send('Error al actualizar empresa en la base de datos');
    }
});

app.delete('/eliminar-empresa/:id', async (req, res) => {
    try {
        const id = req.params.id;
        try {
            const sql = `DELETE FROM empresa WHERE id = ?`;

            await db.query(sql, [parseInt(id)]);

            res.send('Empresa eliminada correctamente');
        } catch (e) {
        }

    } catch (error) {
        console.error('Error al eliminar empresa:', error);
        res.status(500).send('Error al eliminada empresa en la base de datos');
    }
});

app.delete('/eliminar-noticia/:id', async (req, res) => {
    try {
        const id = req.params.id;
        try {
            const sql = `DELETE FROM noticia WHERE id = ?`;

            await db.query(sql, [parseInt(id)]);

            res.send('Noticia eliminada correctamente');
        } catch (e) {
        }

    } catch (error) {
        console.error('Error al eliminar empresa:', error);
        res.status(500).send('Error al eliminada empresa en la base de datos');
    }
});

// Endpoint para guardar datos en la base de datos
app.post('/cargar-empresa', (req, res) => {
    const data = req.body;

    const sql = "INSERT INTO empresa (denominacion, telefono, horarioAtencion, quienesSomos, latitud, longitud, domicilio, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [data.nombre, data.telefono, data.horario, data.quienesSon, data.latitud, data.longitud, data.domicilio, data.email], (err, result) => {
        if (err) {
            console.error('Error al insertar datos:', err);
            res.status(500).send('Error al insertar datos en la base de datos');
            return;
        }
    });

    res.send('Empresa creada correctamente');

});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const uploadPath = path.join(__dirname, '../', '../', 'images/', req.body.nombreEmpresa);
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            console.error(error)
        }

    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post('/cargar-noticia', upload.single('imagen'), (req, res) => {
    const data = req.body;
    const sql = "INSERT INTO noticia (titulo, resumen, imagen, contenidoHTML, publicada, fechaPublicacion, idEmpresa) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [data.titulo, data.resumen, data.imagenSRC, data.contenidoHTML, data.publicada.toUpperCase(), data.fechaPublicacion, data.idEmpresa], (err, result) => {
        if (err) {
            console.error('Error al insertar datos:', err);
            res.status(500).send('Error al insertar datos en la base de datos');
            return;
        }

        res.send('Noticia creada correctamente');
    });
});

app.get('/buscar-noticias', (req, res) => {
    try {
        // Hcemos el callback hacia la db
        db.query("SELECT * FROM noticia WHERE publicada = 'S'", function (err, result) {
            if (err) {
                console.error('Error al buscar datos:', err);
                res.status(500).send('Error al obtener datos de la base de datos');
                return;
            }
            // Crear un objeto JSON a partir de los resultados
            const noticias = result.map(row => {
                return {
                    id: row.id,
                    titulo: row.titulo,
                    resumen: row.resumen,
                    imagenSRC: row.imagen,
                    contenidoHTML: row.contenidoHTML,
                    publicada: row.publicada,
                    fechaPublicacion: row.fechaPublicacion,
                    idEmpresa: row.idEmpresa,
                };
            });
            // Enviar el objeto JSON como respuesta
            return res.json(noticias);
        });
    } catch (error) {
        console.error('Error al buscar datos:', error);
        res.status(500).send('Error al obtener datos de la base de datos');
    }
});

app.put('/actualizar-noticia', upload.single('imagen'), (req, res) => {
    const data = req.body;

    // Construir la consulta SQL para actualizar la noticia
    const sql = `
        UPDATE noticia 
        SET titulo = ?, 
            resumen = ?, 
            imagen = ?, 
            contenidoHTML = ?, 
            publicada = ?, 
            fechaPublicacion = ?, 
            idEmpresa = ? 
        WHERE id = ?`;

    // Ejecutar la consulta SQL con los nuevos datos de la noticia
    db.query(sql, [data.titulo, data.resumen, data.imagenSRC, data.contenidoHTML, data.publicada.toUpperCase(), data.fechaPublicacion, data.idEmpresa, parseInt(data.idNoticia)], (err, result) => {
        if (err) {
            console.error('Error al actualizar la noticia:', err);
            res.status(500).send('Error al actualizar la noticia en la base de datos');
            return;
        }

        res.send('Noticia actualizada correctamente');
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
