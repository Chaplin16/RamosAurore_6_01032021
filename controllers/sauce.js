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
        .then(() => { res.status(201).json({ message: 'sauce créee!'})})
        .catch((error) => {res.status(400).json({ error: error})});
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, id: req.params.id })
        .then(() => res.status(200).json({ message: 'sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        firesystem.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
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
    const likes = req.body.like;
    const dislikes = req.body.dislike;
    const userId = req.body.userId;
    const usersLiked = req.body.usersLiked;
    const usersDisliked= req.body.usersDisliked;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            switch(likes){
                case 1 :
                    if(likes == 1) { // l'utilisateur like la sauce
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {$push: {usersLiked: userId}, $inc: {likes: +1}}
                        )
                        .then(() => res.status(200).json({ message: 'Délicieuse sauce! Très bon choix'}))
                        .catch(error => res.status(400).json({ error }));
                    }    
                break;
                
                case -1 :
                    if(dislikes == -1){ // l'utilisateur dislike la sauce
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {$push: {usersDisliked: userId}, $inc: {dislikes: +1}}
                        )
                        .then(() => res.status(200).json({ message: "Vous n'aimez pas cette sauce! "}))
                        .catch(error => res.status(400).json({ error }));
                    }
                break;
                
                case 0 : 
                    if(likes == 0) {// l'utilisateur annule son like
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {$pull: {usersLiked: userId}, $inc: {likes: -1}}
                        )
                        .then(() => res.status(200).json({ message: 'like supprimé'}))
                        .catch(error => res.status(400).json({ error }));
                    } else if(dislikes == 0){ //l'utilisateur annule son dislike
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {$pull: {usersDisliked: userId}, $inc: {dislikes: -1}}
                        )
                        .then(() => res.status(200).json({ message: 'dislike supprimé '}))
                        .catch(error => res.status(400).json({ error }));
                    }
                break;
            }
        })
        .catch(error => res.status(500).json({ error}));
};

