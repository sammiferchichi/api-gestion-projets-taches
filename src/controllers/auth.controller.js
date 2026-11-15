const Utilisateur = require('../models/Utilisateur');
const generateToken = require('../utils/generateToken');

// inscription d'un nouvel utilisateur
const register = async (req, res) => {
  try {
    const { nom, login, motDePasse, role } = req.body;

    // Verification des champs obligatoires
    if (!nom || !login || !motDePasse) {
      return res.status(400).json({
        message: 'nom, login et motDePasse sont obligatoires',
      });
    }

    // login deja utilise 
    const existe = await Utilisateur.findOne({ login });
    if (existe) {
      return res.status(400).json({ message: 'Ce login est déjà utilisé' });
    }

    // Creation le pre('save') du modèle crypte le mot de passe
    const utilisateur = await Utilisateur.create({ nom, login, motDePasse, role });

    //  Reponse : on ne renvoie JAMAIS le mot de passe
    res.status(201).json({
      _id: utilisateur._id,
      nom: utilisateur.nom,
      login: utilisateur.login,
      role: utilisateur.role,
      createdAt: utilisateur.createdAt,
      token: generateToken(utilisateur),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// connexion et récupération du token
const login = async (req, res) => {
  try {
    const { login: identifiant, motDePasse } = req.body;

    if (!identifiant || !motDePasse) {
      return res.status(400).json({
        message: 'login et motDePasse sont obligatoires',
      });
    }

    const utilisateur = await Utilisateur.findOne({ login: identifiant }).select('+motDePasse');

    if (!utilisateur || !(await utilisateur.verifierMotDePasse(motDePasse))) {
      return res.status(401).json({ message: 'Login ou mot de passe incorrect' });
    }

    res.status(200).json({
      _id: utilisateur._id,
      nom: utilisateur.nom,
      login: utilisateur.login,
      role: utilisateur.role,
      token: generateToken(utilisateur),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };