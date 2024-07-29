const express = require('express');
// Importe le module Mongoose pour interagir avec MongoDB
const mongoose = require('mongoose');
const booksRoutes = require('./routes/books');
// Importe le module Path pour gérer les chemins de fichiers
const path = require('path');
const userRoutes = require('./routes/user');
// Crée une nouvelle application Express
const app = express();



mongoose.connect('mongodb+srv://yann06dev:290982@clusteryann06dev.xu0inrz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterYann06dev',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Utilise le middleware express.json() pour analyser les corps de requête JSON
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

  // Utilise les routes d'authentification sur le chemin '/api/auth'    
  app.use('/api/auth', userRoutes);
  // Utilise les routes de livres sur le chemin '/api/books'
  app.use('/api/books', booksRoutes);

module.exports = app;