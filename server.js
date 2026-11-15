// ici j ai charger les variables du fichier .env
require('dotenv').config();


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');

const app = express();


app.use(cors());            // autorise Postman à appeler l'API
app.use(express.json());    // parse le JSON du body 3ala 5ater sans ça req.body = undefined


app.get('/conn', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

const PORT = Number(process.env.PORT) || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}`);
  });
});