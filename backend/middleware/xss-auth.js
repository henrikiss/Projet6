//Adresse email cryptée
module.exports = (req, res, next) => {
    const userObject = req.body;
    const regex = /<|>|"|&/;
    const isDangerous = regex.test(userObject.email) || regex.test(userObject.password);
    if (isDangerous) {
      res.status(500).json({ message: "Intrusion non autorisée !" });
    } else {
      next();
    }
  };