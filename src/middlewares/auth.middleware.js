const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');


// nchouf ken le token mawjouud fil header 
// Si le token est valide, on met l'utilisateur dans req.utilisateur et on continue
const protect = async (req, res, next) => {
  try {
    let token;


    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // ma famma chay 
    if (!token) {
      return res.status(401).json({ message: 'Non autorisé : token manquant' });
    }

    // Verification de la signature et de l'expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // njib el user mil base (pour avoir le rôle à jour)
    const utilisateur = await Utilisateur.findById(decoded.id);
    if (!utilisateur) {
      return res.status(401).json({ message: 'Non autorisé : utilisateur introuvable' });
    }

    req.utilisateur = utilisateur;
    next();
  } catch (error) {

    res.status(401).json({ message: 'Non autorisé : token invalide ou expiré' });
  }
};

module.exports = { protect };