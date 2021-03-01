const express = require('express');

const app = express();
const dotenv = require('dotenv').config();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/sauce', (req, res, next) => {
    const sauce = [
      {
        id: 'ObjectId',
        userId: 'String',
        name: 'string',
        manifacturer: 'string',
        description: 'String',
        mainPepper: 'string',
        imageUrl: 'string',
        heat: 'number',
        likes: 'number',
        dislikes: 'number',
        usersLiked:'[string]',
        usersDislikes:'[string]'
      },
    ];
    res.status(200).json(sauce);
  });

module.exports = app;