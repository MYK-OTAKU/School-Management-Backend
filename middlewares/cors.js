const cors = require('cors');
require('dotenv').config();

// Configuration CORS avancée
const corsOptions = {
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'],
  exposedHeaders: ['Content-Length', 'Content-Disposition'],
  optionsSuccessStatus: 204,
  maxAge: 86400, // Mise en cache préflight pendant 24h
  preflightContinue: false
};

// Exporter le middleware cors configuré
module.exports = cors(corsOptions);