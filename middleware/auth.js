const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
      //on trouve le numero du token par son emplacement
    const token = req.headers.authorization.split(' ')[1];
    //on le decode
    const decodedToken = jsonwebtoken.verify(token, `${process.env.TOP_SECRET}`);
    //on en fait un objet JS
    const userId = decodedToken.userId;
    //on verifie userId avec celui de la requete
    if (req.body.userId && req.body.userId !== userId) {
      throw "Identitée de l'utilisateur non enregistrée";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('requête non authentifiée!')
    });
  }
};