const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const maskData = require('maskdata');
const User = require('../models/User');

//enregistrement des nouveaux utilisateurs dans BDD
//regex et hachage du mot de passe
exports.signup = (req, res, next) => {
    
    const regexPasseword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    if (!regexPasseword.test(req.body.password)) {
        res.status(401).json({ error: "Le mot de passe doit contenir au minimum 6 caractères dont au moins une majuscule, une minuscule, un chiffre et un caractère special!" })
        return false
    }

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
};

// connections des utilisateurs deja existants
exports.login = (req, res, next) => {
    User.findOne({ email: maskData.maskEmail2(req.body.email) })
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
