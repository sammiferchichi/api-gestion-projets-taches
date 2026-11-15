const express = require('express');
const router = express.Router();

const {
  creerProjet,
  listerProjets,
  obtenirProjet,
  modifierProjet,
  supprimerProjet,
} = require('../controllers/projet.controller');

const { protect } = require('../middlewares/auth.middleware');

// Toutes les routes yelzemhom token valide
router.use(protect);

router.route('/')
  .post(creerProjet)
  .get(listerProjets);

router.route('/:id')
  .get(obtenirProjet)
  .put(modifierProjet)
  .delete(supprimerProjet);

module.exports = router;