const mongoose = require('mongoose');

// Schéma Projet 
const projetSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom du projet est obligatoire'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    proprietaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',   
      required: true,
    },
    statut: {
      type: String,
      enum: {
        values: ['en cours', 'termine', 'en pause'],
        message: 'Le statut doit être : en cours, terminé ou en pause',
      },
      default: 'en cours',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Projet', projetSchema);