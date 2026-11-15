const express = require('express');
const router = express.Router();

const {
  creerTache,
  listerTaches,
  obtenirTache,
  modifierTache,
  supprimerTache,
  affecterTache,
} = require('../controllers/tache.controller');

const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');


router.use(protect);

router.patch('/:id/assign', authorize('manager'), affecterTache);

router.route('/')
  .post(creerTache)
  .get(listerTaches);

router.route('/:id')
  .get(obtenirTache)
  .put(modifierTache)
  .delete(supprimerTache);

module.exports = router;