const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

// Importe les contrôleurs pour les livres
const booksCtrl = require('../controllers/books');

// Route pour obtenir tous les livres
router.get('/', booksCtrl.getAllBooks);
// Route pour obtenir un livre spécifique, nécessite une authentification
router.get('/:id',auth, booksCtrl.getOneBook);
// Route pour créer un nouveau livre, nécessite une authentification
// et Multer pour gérer les fichiers entrants
router.post('/', auth, multer, booksCtrl.createBook);
// Route pour modifier un livre spécifique, nécessite une authentification 
// et Multer pour gérer les fichiers entrants
router.put('/:id', auth, multer, booksCtrl.modifyBook);
// Route pour supprimer un livre spécifique, nécessite une authentification
router.delete('/:id',auth, booksCtrl.deleteBook);


module.exports = router;