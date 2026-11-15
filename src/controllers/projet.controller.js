const mongoose = require('mongoose');
const Projet = require('../models/Projet');
const Tache = require('../models/Tache');

// Un projet est modifiable par son propriétaire OU par un manager
const peutGerer = (projet, utilisateur) => {
  return (
    utilisateur.role === 'manager' ||
    projet.proprietaire.toString() === utilisateur._id.toString()
  );
};

// Reponse d'erreur commune : 400 si validation, 500 sinon
const erreurReponse = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: error.message });
};

// cree un projet Accessible à tout utilisateur authentifie (user ou manager)
const creerProjet = async (req, res) => {
  try {
    const { nom, description, statut } = req.body;

    if (!nom) {
      return res.status(400).json({ message: 'Le nom du projet est obligatoire' });
    }

    const projet = await Projet.create({
      nom,
      description,
      statut,
      //  le propriétaire yjii min TOKEN, mouch min body
      proprietaire: req.utilisateur._id,
    });

    res.status(201).json(projet);
  } catch (error) {
    erreurReponse(res, error);
  }
};

// liste des projets 
// Manager 3anndo tous les projets et  user 3ando seulement les siens
// liste + recherche + tri 
const listerProjets = async (req, res) => {
  try {
    const { search, statut, sort, order } = req.query;

    const filtre =
      req.utilisateur.role === 'manager'
        ? {}
        : { proprietaire: req.utilisateur._id };


    if (search) {
      filtre.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (statut) {
      filtre.statut = statut;
    }

    // Tri 
    const champsTriables = ['nom', 'statut', 'createdAt'];
    const champ = champsTriables.includes(sort) ? sort : 'createdAt';
    const sens = order === 'asc' ? 1 : -1; // -1 = décroissant (défaut)

    const projets = await Projet.find(filtre)
      .populate('proprietaire', 'nom login')
      .sort({ [champ]: sens });

    res.status(200).json(projets);
  } catch (error) {
    erreurReponse(res, error);
  }
};


const obtenirProjet = async (req, res) => {
  try {
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant de projet invalide' });
    }

    const projet = await Projet.findById(req.params.id).populate('proprietaire', 'nom login');

    if (!projet) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }

    // user ma3andouch el acces
    if (!peutGerer(projet, req.utilisateur)) {
      return res.status(403).json({ message: 'Accès refusé : ce projet ne vous appartient pas' });
    }

    res.status(200).json(projet);
  } catch (error) {
    erreurReponse(res, error);
  }
};

// modifier
const modifierProjet = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant de projet invalide' });
    }

    const projet = await Projet.findById(req.params.id);

    if (!projet) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }

    if (!peutGerer(projet, req.utilisateur)) {
      return res.status(403).json({ message: 'Accès refusé : ce projet ne vous appartient pas' });
    }

    const { nom, description, statut } = req.body;

    // On ne modifie que les champs réellement envoyés
    if (nom !== undefined) projet.nom = nom;
    if (description !== undefined) projet.description = description;
    if (statut !== undefined) projet.statut = statut;

    await projet.save();  
    res.status(200).json(projet);
  } catch (error) {
    erreurReponse(res, error);
  }
};

// DELETE 
const supprimerProjet = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant de projet invalide' });
    }

    const projet = await Projet.findById(req.params.id);

    if (!projet) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }

    if (!peutGerer(projet, req.utilisateur)) {
      return res.status(403).json({ message: 'Accès refusé : ce projet ne vous appartient pas' });
    }

    //await projet.deleteOne();
    // kif yitfase5 projet yitfas5 zeda tache (suppression en cascade)
    await Tache.deleteMany({ projet: projet._id });
    await projet.deleteOne();

    res.status(200).json({ message: 'Projet supprimé', id: projet._id });
  } catch (error) {
    erreurReponse(res, error);
  }
};

module.exports = {
  creerProjet,
  listerProjets,
  obtenirProjet,
  modifierProjet,
  supprimerProjet,
};