const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Fonction pour l'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  bcrypt
    // Hache le mot de passe avec un salt de 10 tours
    .hash(req.body.password, 10)
    .then((hash) => {
      // Crée un nouvel utilisateur
      const user = new User({
        email: req.body.email,
        // Stocke le mot de passe haché
        password: hash,
      });
      user
        // Sauvegarde l'utilisateur dans la base de données
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    // Envoie une erreur si le mot de passe n'a pas pu être haché
    .catch((error) => res.status(500).json({ error }));
};

// Fonction pour la connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  // Cherche l'utilisateur dans la base de données
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        // Compare le mot de passe entré avec le mot de passe haché stocké
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // Envoie une réponse de succès avec un token JWT
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
