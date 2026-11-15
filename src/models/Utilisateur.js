const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema Utilisateur 
const utilisateurSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
    },
    login: {
      type: String,
      required: [true, 'Le login est obligatoire'],
      unique: true,          
      trim: true,
      lowercase: true,       
    },
    motDePasse: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false,         // manab3thouch fi les requette par defaut
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'manager'],
        message: 'Le rôle doit être user ou manager',
      },
      default: 'user',
    },
  },
  {
    timestamps: true,        // ajoute createdAt et updatedAt automatiquement
  }
);

