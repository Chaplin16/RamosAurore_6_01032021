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
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);