// n5alli ken les roles passe en paramètre : authorize('manager')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.utilisateur || !roles.includes(req.utilisateur.role)) {
      return res.status(403).json({
        message: `Accès refusé : rôle ${roles.join(' ou ')} requis`,
      });
    }
    next();
  };
};

module.exports = { authorize };