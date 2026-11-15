const mongoose = require('mongoose');
const Tache = require('../models/Tache');
const Projet = require('../models/Projet');
const Utilisateur = require('../models/Utilisateur');



const erreurReponse = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: error.message });
};
// nchari une tache w ba3ed nverifie les droits ( manager , proprieter)
// En cas de problème, la réponse est déjà envoyée  donc on renvoie null.
const chargerTacheAutorisee = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Identifiant de tâche invalide' });
    return null;
  }

  const tache = await Tache.findById(req.params.id).populate('projet', 'nom proprietaire');

  if (!tache) {
    res.status(404).json({ message: 'Tâche introuvable' });
    return null;
  }

  const estManager = req.utilisateur.role === 'manager';
  const estProprietaire =
    tache.projet && tache.projet.proprietaire.toString() === req.utilisateur._id.toString();

  if (!estManager && !estProprietaire) {
    res.status(403).json({ message: 'Accès refusé : vous ne gérez pas ce projet' });
    return null;
  }

  return tache;
};



const creerTache = async (req, res) => {
  try {
    const { titre, description, statut, deadline, projet, assigneA } = req.body;

    if (!titre) {
      return res.status(400).json({ message: 'Le titre de la tâche est obligatoire' });
    }
    if (!projet) {
      return res.status(400).json({ message: 'Le projet associé est obligatoire' });
    }
    if (!mongoose.Types.ObjectId.isValid(projet)) {
      return res.status(400).json({ message: 'Identifiant de projet invalide' });
    }

    const projetExiste = await Projet.findById(projet);
    if (!projetExiste) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }

    //  hna 3anna seul le manager peut affecter une tâche
    if (assigneA && req.utilisateur.role !== 'manager') {
      return res.status(403).json({ message: 'Seul un manager peut affecter une tâche' });
    }

    const tache = await Tache.create({
      titre,
      description,
      statut,
      deadline,
      projet,
      assigneA: req.utilisateur.role === 'manager' ? assigneA || null : null,
    });

    res.status(201).json(tache);
  } catch (error) {
    erreurReponse(res, error);
  }
};



const listerTaches = async (req, res) => {
  try {
    let filtre;

    if (req.utilisateur.role === 'manager') {
      filtre = {}; // le manager voit toutes les tâches
    } else {
      // un user voit les tâches de SES projets + celles qui lui sont affectées
      const mesProjets = await Projet.find({ proprietaire: req.utilisateur._id }).select('_id');
      filtre = {
        $or: [
          { projet: { $in: mesProjets.map((p) => p._id) } },
          { assigneA: req.utilisateur._id },
        ],
      };
    }

    const taches = await Tache.find(filtre)
      .populate('projet', 'nom statut')
      .populate('assigneA', 'nom login')
      .sort({ createdAt: -1 });

    res.status(200).json(taches);
  } catch (error) {
    erreurReponse(res, error);
  }
};


const obtenirTache = async (req, res) => {
  try {
    const tache = await chargerTacheAutorisee(req, res);
    if (!tache) return;

    res.status(200).json(tache);
  } catch (error) {
    erreurReponse(res, error);
  }
};


const modifierTache = async (req, res) => {
  try {
    const tache = await chargerTacheAutorisee(req, res);
    if (!tache) return;

    const { titre, description, statut, deadline } = req.body;

    if (titre !== undefined) tache.titre = titre;
    if (description !== undefined) tache.description = description;
    if (statut !== undefined) tache.statut = statut;
    if (deadline !== undefined) tache.deadline = deadline;

    await tache.save();

    res.status(200).json(tache);
  } catch (error) {
    erreurReponse(res, error);
  }
};


const supprimerTache = async (req, res) => {
  try {
    const tache = await chargerTacheAutorisee(req, res);
    if (!tache) return;

    await tache.deleteOne();

    res.status(200).json({ message: 'Tâche supprimée', id: tache._id });
  } catch (error) {
    erreurReponse(res, error);
  }
};


const affecterTache = async (req, res) => {
  try {
    const { utilisateurId } = req.body;

    if (!utilisateurId) {
      return res.status(400).json({ message: 'utilisateurId est obligatoire' });
    }
    if (!mongoose.Types.ObjectId.isValid(utilisateurId)) {
      return res.status(400).json({ message: 'Identifiant utilisateur invalide' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant de tâche invalide' });
    }

    const utilisateur = await Utilisateur.findById(utilisateurId);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const tache = await Tache.findById(req.params.id);
    if (!tache) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    tache.assigneA = utilisateur._id;
    await tache.save();

    res.status(200).json(tache);
  } catch (error) {
    erreurReponse(res, error);
  }
};

module.exports = {
  creerTache,
  listerTaches,
  obtenirTache,
  modifierTache,
  supprimerTache,
  affecterTache,
};