const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Définit les types MIME pour les images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configure le stockage des fichiers en mémoire
const storage = multer.memoryStorage();

module.exports = multer({ storage: storage }).single('image');

// Pour redimensionner les images uploadées
module.exports.resizeImage = (req, res, next) => {
  // Vérifie si un fichier est téléchargé
  if (!req.file) return next();

  const { buffer, originalname } = req.file;
  const name = originalname.split(' ').join('_').split('.')[0];
  const filename = `${name}_${Date.now()}.webp`;
  const outputFilePath = path.join('images', filename);

  sharp(buffer)
    .resize(206, 260, {fit: 'contain'})
    .toFormat('webp')
    .toFile(outputFilePath)
    .then(() => {
      // Met à jour le chemin et le nom du fichier dans la requête
      req.file.filename = filename;
      req.file.path = outputFilePath;
      next();
    })
    .catch(err => {
      console.error(err);
      next();
    });
};