const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

 

const userSchema = mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function (value) {
              return /^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i.test(value);
            },
            message: "Entrez un email valide "
        }
        
    },
    password: { 
        type: String, 
        required: true,
        minlength: [6, "pas moins de 6 caratères"],
        validate: {
            validator: function (value) {
              return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])$/.test(value);
            },
            message: "Entrez un MDP de 6 caractères dont 1maj, 1min et 1chiffre "
        }
    }
});




userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);