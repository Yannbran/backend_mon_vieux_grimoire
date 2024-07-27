const multer = require('multer');

// Définit les types MIME pour les images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// Configure le stockage des fichiers sur le disque
const storage = multer.diskStorage({
  // Les fichiers seront stockés dans le dossier 'images'
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // Le nom du fichier est le nom original avec les espaces remplacés par des underscores
    const name = file.originalname.split(' ').join('_');
    // L'extension du fichier est déterminée par le type MIME
    const extension = MIME_TYPES[file.mimetype];
    // Le nom final du fichier est 'nom+timestamp.extension'
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');