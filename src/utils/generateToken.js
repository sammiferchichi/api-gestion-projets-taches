const jwt = require('jsonwebtoken');


// j ai genere un token  fih ( id et le role mte3 user  )
const generateToken = (utilisateur) => {
  return jwt.sign(
    { id: utilisateur._id, role: utilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;