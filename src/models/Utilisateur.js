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


// 9bal ay save : on crypte le mot de passe seulement s'il a été modifié

utilisateurSchema.pre('save', async function () {
  if (!this.isModified('motDePasse')) return; // sinon on re-hashe un hash
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

// comparer un mot de passe en clair avec le hash stocké
utilisateurSchema.methods.verifierMotDePasse = async function (motDePasseSaisi) {
  return bcrypt.compare(motDePasseSaisi, this.motDePasse);
};