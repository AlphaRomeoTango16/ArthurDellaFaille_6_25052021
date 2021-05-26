const Sauce = require('../models/Sauce');
const fs= require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
           ...JSON.parse(req.body.sauce),
           imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
         } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error =>
            res.status(400).json({ error })
            );
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId
    const sauceLike = req.body.likes;
    const sauceDislike = req.body.dislikes;
    const usersLiked = req.body.usersLiked;
    const usersDisliked = req.body.usersDisliked;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauceLike == +1) {
                usersLiked.push(userId);
                sauceLike.inc(+1);
            } else if (sauceLike == -1) {
                usersDisliked.push(userId);
                sauceDislike.inc(-1);
            } else if (sauceLike == 0) {
                usersLiked.push(userId);
                usersDisliked.push(userId);
                sauceLike.inc(0);
                sauceDislike.inc(0);
            }
        })
        .catch(error => res.status(500).json({ error }));
}
