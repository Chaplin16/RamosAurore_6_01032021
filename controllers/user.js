const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const maskData = require('maskdata');
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
        throw {error:'le mdp doit contenir au moins 8 caractères dont 1chiffre, 1 lettre majuscule et 1 minuscule'}
    }else {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
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
    User.findOne({ email: maskData.maskEmail2(req.body.email)})
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Il n y a pas d'utilisateur avec ce mail!" });
            }

            const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,4}$/;
            if (!regexEmail.test(req.body.email)) {
                res.status(401).json({ error: "Rentrez un mail valide" })
                return false
            }  
        
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jsonwebtoken.sign(
                            { userId: user._id },
                            `${process.env.TOP_SECRET}`,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
