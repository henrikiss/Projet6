const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  exports.getSauceById = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

  exports.addSauce = (req, res, next) => {
    if (!req.body.sauce) {
      return res.status(400).send(new Error('Bad request: ' + JSON.stringify(res.body)));
    }
    console.log('DATA IMAGE: '+ JSON.stringify(req.body.sauce));
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };
  

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

  //Like et Dislike
exports.likeDislikeSauce = (req, res, next) => {
  if (req.body.like === 1) {
    const monLike = req.body.like;
    console.log('LIKE: '+ monLike );
    //l'utilisateur aime la sauce
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } }) // on ajoute 1 like
      .then((sauce) => res.status(200).json({ message: "Un like en plus !" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    //L'utilisateur n'aime pas la sauce
    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: req.body.like++ * -1 }, $push: { usersDisliked: req.body.userId } })
      .then((sauce) => res.status(200).json({ message: "Un dislike en plus !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    // si l'utilisateur enleve son vote, like === 0
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }) // $pull : Vide le tableau et empêche de voter plusieurs fois par un même utilisateur
            .then((sauce) => {
              res.status(200).json({ message: "Un like en moins !" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
            .then((sauce) => {
              res.status(200).json({ message: "Un dislike en moins !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

