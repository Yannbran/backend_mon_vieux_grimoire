const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const booksRoutes = require('./routes/books');
const path = require('path');
const userRoutes = require('./routes/user');
const app = express();

app.use(cors()); // Utilise le middleware cors

mongoose.connect('mongodb+srv://yann06dev:290982@clusteryann06dev.xu0inrz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterYann06dev',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

  app.use('/api/auth', userRoutes);
  app.use('/api/books', booksRoutes);

module.exports = app;