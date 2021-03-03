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
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    const likes = req.body.likes;
    const dislikes = req.body.dislikes;
    const userId = req.body.userId;
    const usersLiked = req.body.usersLiked;
    const usersDisliked= req.body.usersDisliked;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //utiliser switch et case
// si le user like on ajoute de 1 le like
            if(sauce.usersLiked) {
                Sauce.updateOne({ _id: req.params.id }, {likes: +1})  
                    .then(() => res.status(201).json({message: 'sauce appréciée'})) 
                    .catch(error => res.status(400).json({ error }));     
            }
//si le user dislike on enleve 1 aux likes
            if(sauce.usersDisliked) {
                Sauce.updateOne({ _id: req.params.id }, {likes: -1})  
                    .then(() => res.status(201).json({message: 'sauce non aimée'})) 
                    .catch(error => res.status(400).json({ error }));     
            }
        })
        .catch(error => res.status(500).json({ error }));
}

