const http = require('http');
const app = require('./app');

// Fonction pour normaliser le port que notre serveur va écouter
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// Définition du port d'écoute de notre serveur
const port = normalizePort(process.env.PORT ||'3000');
app.set('port', port);

// Fonction pour gérer les erreurs lors de la création du serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// Création du serveur
const server = http.createServer(app);
// Gestion des erreurs du serveur
server.on('error', errorHandler);
// Gestion de l'écoute du serveur
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
// Démarrage du serveur
server.listen(port);