// Importe le module File System pour gérer les fichiers
const fs = require("fs");
const Book = require("../models/Book");



// Fonction pour créer un nouveau livre
exports.createBook = (req, res, next) => {
  // Parse le corps de la requête en JSON
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  // Crée un nouvel objet livre
  const book = new Book({
    ...bookObject,
    // Ajoute l'ID de l'utilisateur
    userId: req.auth.userId,
    // Ajoute l'URL de l'image
    imageUrl: `${req.protocol}://${req.get("host")}/images/resized_${req.file.filename}`,
    // Calcule la moyenne des notes
    averageRating: bookObject.ratings[0].grade   
  });
  // Sauvegarde le livre dans la base de données
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Fonction pour modifier un livre existant
exports.modifyBook = (req, res, next) => {
  // Si un fichier est fourni
  const bookObject = req.file
    ? {
        // Parse le corps de la requête en JSON
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/resized_${
          req.file.filename
        }`,
      }
    : { ...req.body };
  // Supprime l'ID de l'utilisateur
  delete bookObject._userId;
  // Cherche le livre dans la base de données
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Si l'ID de l'utilisateur ne correspond pas à l'ID de l'utilisateur du livre
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: "Non autorisé" });
      } else {
        // Sinon, met à jour le livre
        return Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        ).then(() => res.status(200).json({ message: "Livre modifié!" }));
        console.log(error).catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Fonction pour supprimer un livre existant
exports.deleteBook = (req, res, next) => {
  // Cherche le livre dans la base de données
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Si l'ID de l'utilisateur ne correspond pas à l'ID de l'utilisateur du livre
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        // Obtient le nom du fichier de l'image
        const filename = book.imageUrl.split("/images/")[1];
        // Supprime l'image du livre
        fs.unlink(`images/${filename}`, () => {
          // Supprime le livre de la base de données
          return Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Fonction pour obtenir un livre spécifique
exports.getOneBook = (req, res, next) => {
  Book.findOne({
    // Utilise l'ID du livre fourni
    _id: req.params.id,
  })
    .then((book) => {
      // Envoie le livre en réponse
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Renvoi les 3 livres les mieux notés
exports.getBestRating = (req, res, next) => {
  // Récupération de tous les livres, méthode find() de mongoose
  // Puis tri (.sort) par rapport aux notes dans l'ordre décroissant (-1), (limit) aux 3 premiers éléments
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
};

exports.ratingBook = (req, res, next) => {
  // Création d'un objet updatedRating contenant l'ID de l'utilisateur et la note donnée 
  const updatedRating = {
      userId: req.auth.userId,
      grade: req.body.rating
  };
  // Vérification que la note est comprise entre 0 et 5
  if (updatedRating.grade < 0 || updatedRating.grade > 5) {
      return res.status(400).json({ message: 'Veuillez choisir une note entre 0 et 5' });
  }
  // Recherche du livre par son ID
  Book.findOne({ _id: req.params.id }) 
      .then((book) => {
          // Vérification si l'utilisateur a déjà noté ce livre
          if (book.ratings.find(r => r.userId === req.auth.userId)) { 
              return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
          } else {
              // Ajout de la nouvelle note au tableau des notes du livre
              book.ratings.push(updatedRating); 
              // Fonction calculant la moyenne des notes
              const calculateAverage = (ratings) => {
                  let sum = 0;
                  for (let rating of ratings) {
                      sum += rating.grade;
                  }
                  return (sum / ratings.length).toFixed(1);
              };
              // Mise à jour de la note moyenne du livre
              book.averageRating = calculateAverage(book.ratings);
              // Sauvegarde du livre mis à jour
              return book.save(); 
          }
      })
      // Envoi du livre mis à jour en réponse
      .then((updatedBook) => res.status(201).json(updatedBook))
      // Gestion des erreurs
      .catch(error => res.status(400).json({ error }));
};