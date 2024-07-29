// Importe le module File System pour gérer les fichiers
const fs = require('fs');
const Book = require('../models/Book');



// Fonction calculant la moyenne des nombres d'un tableau
exports.average = (array) => {
  // Initialise la somme à 0
  let sum = 0;
  // Parcourt chaque nombre dans le tableau
  for (let nb of array) {
      // Ajoute le nombre actuel à la somme
      sum += nb;
  };
  // Calcule la moyenne en divisant la somme par le nombre d'éléments dans le tableau
  // Utilise toFixed(1) pour arrondir le résultat à un chiffre après la virgule
  return (sum/array.length).toFixed(1);
}

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
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // Calcule la moyenne des notes
        averageRating: bookObject.ratings && bookObject.ratings.length > 0 ? 
        exports.average(bookObject.ratings.map(rating => rating.grade)) : 0
    });
    // Sauvegarde le livre dans la base de données
    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

 // Fonction pour modifier un livre existant
 exports.modifyBook = (req, res, next) => {
    // Si un fichier est fourni
    const bookObject = req.file ? {
        // Parse le corps de la requête en JSON
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // Supprime l'ID de l'utilisateur
    delete bookObject._userId;
    // Cherche le livre dans la base de données
    Book.findOne({_id: req.params.id})
        .then((book) => {
            // Si l'ID de l'utilisateur ne correspond pas à l'ID de l'utilisateur du livre
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non autorisé'});
            } else {
                // Sinon, met à jour le livre
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                console.log(error)
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

 // Fonction pour supprimer un livre existant
 exports.deleteBook = (req, res, next) => {
    // Cherche le livre dans la base de données
   Book.findOne({ _id: req.params.id})
       .then(book => {
          // Si l'ID de l'utilisateur ne correspond pas à l'ID de l'utilisateur du livre
           if (book.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
              // Obtient le nom du fichier de l'image
               const filename = book.imageUrl.split('/images/')[1];
               // Supprime l'image du livre
               fs.unlink(`images/${filename}`, () => {
                  // Supprime le livre de la base de données
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

// Fonction pour obtenir un livre spécifique
  exports.getOneBook = (req, res, next) => {
    Book.findOne({
      // Utilise l'ID du livre fourni
      _id: req.params.id
    }).then(
      (book) => {
        // Envoie le livre en réponse
        res.status(200).json(book);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

  exports.getAllBooks = (req, res, next) => {
    Book.find().then(
      (books) => {
        res.status(200).json(books);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  // Renvoi les 3 livres les mieux notés
  exports.getBestRating = (req, res, next) => {
    // Récupération de tous les livres, méthode find() de mongoose
    // Puis tri (.sort) par rapport aux notes dans l'ordre décroissant (-1), (limit) aux 3 premiers éléments
    Book.find().sort({averageRating: -1}).limit(3)
        .then((books)=>res.status(200).json(books))
        .catch((error)=>res.status(404).json({ error }));
};