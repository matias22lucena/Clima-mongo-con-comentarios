const express = require('express'); // Importar el framework Express
const mongoose = require('mongoose'); // Importar Mongoose para MongoDB
const cors = require('cors'); // Importar CORS para permitir solicitudes de diferentes orígenes
const bodyParser = require('body-parser'); // Importar bodyParser para analizar cuerpos de solicitud JSON

const app = express(); // Crear una aplicación Express
const port = 3000; // Puerto en el que se ejecutará el servidor

// Middleware
app.use(cors()); // Habilitar CORS
app.use(bodyParser.json()); // Habilitar el análisis de cuerpos JSON

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/climaDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB')) // Mensaje al conectar exitosamente
  .catch(err => console.error('Error al conectar a MongoDB', err)); // Manejo de errores de conexión

// Definir el esquema y el modelo de Mongoose
const busquedaSchema = new mongoose.Schema({
  ciudad: String,
  fecha: { type: Date, default: Date.now },
  clima: String
});

const Busqueda = mongoose.model('Busqueda', busquedaSchema); // Crear el modelo a partir del esquema

// Ruta para guardar el clima en el historial
app.post('/clima', async (req, res) => {
  const { ciudad, clima } = req.body; // Obtener datos de la solicitud

  const nuevaBusqueda = new Busqueda({ ciudad, clima }); // Crear una nueva instancia del modelo Busqueda
  await nuevaBusqueda.save(); // Guardar la instancia en la base de datos

  res.send({ message: 'Historial guardado' }); // Enviar una respuesta al cliente
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`); // Iniciar el servidor y mostrar un mensaje en la consola
});
