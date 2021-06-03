//surveillance de constantes non déclarées
module.exports = (req, res, next) => {
    let sauceObject;
    if (req.file) {
      sauceObject = {
        ...JSON.parse(req.body.sauce),
      };
    } else {
      sauceObject = { ...req.body };
    }
    const regex = /<|>|"|&/;
    const isDangerous = regex.test(sauceObject.name) || regex.test(sauceObject.manufacturer) || regex.test(sauceObject.description) || regex.test(sauceObject.mainPepper);
    if (isDangerous) {
      res.status(500).json({ message: "Attaque XSS suspectée." });
    } else {
      next();
    }
  };