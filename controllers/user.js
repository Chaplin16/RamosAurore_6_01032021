const bcrypt = require('bcrypt'); 
const jsonwebtoken = require('jsonwebtoken'); //creation de token et verification
const maskData = require('maskdata'); //masque email dans BDD
const passwordValidator = require('password-validator');
const User = require('../models/User');

//creation du schema
let schema = new passwordValidator();
schema
.is().min(8) //au moins 8 caractères
.is().max(20) // pas plus de 20 caractères
.has().uppercase() // au moins une minuscule
.has().lowercase() // au moins une majuscule
.has().digits(1) // au moins un chiffre
.has().not().spaces()  //pas d espaces                         
.is().not().oneOf(['Passw0rd', 'Password123']); // pas de mdp bateau

//enregistrement des nouveaux utilisateurs dans BDD
//regex et hachage du mot de passe
exports.signup = (req, res, next) => {
    if(!schema.validate(req.body.password)) {
        throw {error:'le mot de passe doit contenir au moins 8 caractères dont 1chiffre, 1 lettre majuscule et 1 minuscule'}
    }else {
        bcrypt.hash(req.body.password, 10) //hash le mot de passe, on execute 10 fois l algorithme de hachage
            .then(hash => {
                const user = new User({ //on recupere le hash du MDP et on le met ds un objet pour l enregistrer dans la BDD
                    email: maskData.maskEmail2(req.body.email),
                    password: hash
                });
                //enregistrement de l utilisateur avec retour promise
                user.save()
                    .then(() => res.status(201).json({ message: 'Nouvel utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
        }
};

// connections des utilisateurs deja existants
exports.login = (req, res, next) => {
    User.findOne({ email: maskData.maskEmail2(req.body.email)}) //on trouve le user ds la BDD qui correspond à ladresse email qui est rentré par l utilisateur de l application
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Il n y a pas d'utilisateur avec ce mail!" });
            }

            const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,4}$/;
            if (!regexEmail.test(req.body.email)) {
                res.status(401).json({ error: "Rentrez un mail valide" })
                return false
            }  
        
            bcrypt.compare(req.body.password, user.password) // on compare le mdp qui est envoye dans la requete avec le mdp hashé qui est dans la BDD,
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jsonwebtoken.sign( //fonction sign prend en argument
                            { userId: user._id }, //1 argument : les données que l on veut encoder à l int de ce token  /  user id etant l identifiant de la requete 
                            `${process.env.TOP_SECRET}`, // 2ieme argument : clef secrete de l encodage 
                            { expiresIn: '24h' } // chq TOKEN dure 24h 
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
