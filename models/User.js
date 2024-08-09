const mongoose = require('mongoose');
// Importation du plugin mongoose-unique-validator pour garantir 
// que les adresses électroniques stockées dans la base de données sont uniques.
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);