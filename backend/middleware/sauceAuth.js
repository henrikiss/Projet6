const jwt = require("jsonwebtoken");
const sauce = require("../models/Sauce");
const mongoSanitize = require('mongo-sanitize');

module.exports = (req, res, next) => {
  const id = mongoSanitize(req.params.id);
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;
  sauce
    .findOne({ _id: id })
    .then((sauce) => {
      if (sauce.userId !== userId) {
        res.status(401).json({ message: "Action non autorisée, vous n'êtes pas le propriétaire !" });
      } else {
        next();
      }
    })
    .catch((error) => res.status(500).json({ error }));
};