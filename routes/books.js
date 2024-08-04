const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

// Importe les contrôleurs pour les livres
const booksCtrl = require('../controllers/books');

// Route pour obtenir tous les livres
router.get('/', booksCtrl.getAllBooks);
// Pour obtenir les meilleurs livres
router.get('/bestrating', booksCtrl.getBestRating);
// Route pour obtenir un livre spécifique 
router.get('/:id', booksCtrl.getOneBook);
// Route pour créer un nouveau livre, nécessite une authentification
// et Multer pour gérer les fichiers entrants
router.post('/', auth, multer, multer.resizeImage, booksCtrl.createBook);
// Pour noter un livre
router.post('/:id/rating', auth, booksCtrl.ratingBook); 
// Route pour modifier un livre spécifique, nécessite une authentification 
// et Multer pour gérer les fichiers entrants
router.put('/:id', auth, multer, multer.resizeImage, booksCtrl.modifyBook);
// Route pour supprimer un livre spécifique, nécessite une authentification
router.delete('/:id',auth, booksCtrl.deleteBook);


module.exports = router;