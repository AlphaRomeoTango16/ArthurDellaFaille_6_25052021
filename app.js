const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Sauce = require('./models/sauce');

mongoose.connect('mongodb+srv://arthur_16:AlphaRomeo16@cluster0.srb2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.post('/api/sauce', (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
        .catch(() => res.status(400).json({ error }));
});

app.put('/api/sauce/:id', (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.statuts(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
});

app.delete('/api/sauce/:id', (req, res, next) =>{
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
        .catch(error => res.status(400).json({ error }));
});

app.get('/api/sauce/:id', (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
});

app.get('/api/sauce', (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
});

module.exports = app;