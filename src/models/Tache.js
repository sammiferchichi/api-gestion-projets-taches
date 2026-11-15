const mongoose = require('mongoose');

// Schéma Tâche 
const tacheSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, 'Le titre de la tâche est obligatoire'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    statut: {
      type: String,
      enum: {
        values: ['todo', 'doing', 'done'], 
        message: 'Le statut doit être : todo, doing ou done',
      },
      default: 'todo',
    },
    deadline: {
      type: Date,
    },
    projet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Projet',
      required: [true, 'La tâche doit être rattachée à un projet'],
    },
    assigneA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',
      default: null,      
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tache', tacheSchema);