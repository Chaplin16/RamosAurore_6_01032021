const Sauce = require('../models/Sauce');
const firesystem = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // on parse la chaine en caractère en objet
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, //operateur spread pour faire une copie de ts les elements envoyes du front end
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //on recree un url
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
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, id: req.params.id }) //verification de l id du user modificateur
        .then(() => res.status(200).json({ message: 'sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //on recherche la sauce pour avoir son url pour avoir acces au fichier 
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            firesystem.unlink(`images/${filename}`, () => {//methode unlink pour supprimer un fichier/ en premier argument le chemin de l image 
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

exports.getAllSauces = (req, res, next) => {  // on repond uniquement aux demandes GET a cet endpoint 
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //  findOne c est pour trouver un seul objet (on veut que l id trouvé soit le meme que le id de la requete)
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
                    if (sauce.usersLiked.some(userId => userId == req.body.userId)) {//methode some : si un element du tableau repond a la fonction/retourne un booleen
                        sauce.likes -= 1;
                        sauce.usersLiked = sauce.usersLiked.filter(userId => userId != req.body.userId); //methode filter: retourne un new tableau contenant tous les elements du tableau qui repond à la fonction
                    } else { //si un utilisateur enleve son dislike
                        sauce.dislikes -= 1;
                        sauce.usersDisliked = sauce.usersDisliked.filter(userId => userId != req.body.userId);
                    }
                    break;
                default: //si un autre cas arrive
                    console.log('erreur dans les likes/dislikes');
            }
            sauce.save() //enregistrement
                .then(() => res.status(200).json())
                .catch(error => res.status(400).json({ error }));
        })
}

