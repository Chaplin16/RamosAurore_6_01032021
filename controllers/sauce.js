const Sauce = require('../models/Sauce');
const firesystem = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, //pour faire une copie de ts les elements envoyes du front end
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'sauce créee!' }) })
        .catch((error) => { res.status(400).json({ error: error }) });
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, id: req.params.id })
        .then(() => res.status(200).json({ message: 'sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            firesystem.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                case 1: //si un utilisateur clique sur un like 
                    sauce.likes += 1;
                    sauce.usersLiked.push(req.body.userId);
                    break;
                case -1: //si un utilisateur clique sur un dislike
                    sauce.dislikes += 1;
                    sauce.usersDisliked.push(req.body.userId);
                    break;
                case 0: //si un utilisateur enleve son like
                    if (sauce.usersLiked.some(userId => userId == req.body.userId)) {
                        sauce.likes -= 1;
                        sauce.usersLiked = sauce.usersLiked.filter(userId => userId != req.body.userId);
                    } else { //si un utilisateur enleve son dislike
                        sauce.dislikes -= 1;
                        sauce.usersDisliked = sauce.usersDisliked.filter(userId => userId != req.body.userId);
                    }
                    break;
                default: //si un autre cas arrive
                    cobnsole.log('erreur dans les likes/dislikes');
            }
            sauce.save() //enregistrement
                .then(() => res.status(200).json())
                .catch(error => res.status(400).json({ error }));
        })
}

