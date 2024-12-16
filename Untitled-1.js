// Importation des modules nécessaires
const mongoose = require('mongoose');
require('dotenv').config(); // Charge les variables d'environnement du fichier .env

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Vérification de la connexion
mongoose.connection.once('open', () => {
  console.log('Connexion à MongoDB établie avec succès');
}).on('error', (error) => {
  console.error('Erreur de connexion à MongoDB:', error);
});

// Définition du schéma et du modèle
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

const Person = mongoose.model('Person', personSchema);

// Création et sauvegarde d'un enregistrement
const createAndSavePerson = (done) => {
  const newPerson = new Person({
    name: 'John Doe',
    age: 30,
    favoriteFoods: ['Pizza', 'Burger'],
  });

  newPerson.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// Création de plusieurs enregistrements
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// Recherche de toutes les personnes par nom
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// Recherche d'une personne par aliment favori
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// Recherche d'une personne par ID
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// Mise à jour classique
const findEditThenSave = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return done(err);

    person.favoriteFoods.push('Hamburger');
    person.save((err, updatedPerson) => {
      if (err) return done(err);
      done(null, updatedPerson);
    });
  });
};

// Mise à jour avec findOneAndUpdate
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    (err, updatedPerson) => {
      if (err) return done(err);
      done(null, updatedPerson);
    }
  );
};

// Suppression par ID
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return done(err);
    done(null, removedPerson);
  });
};

// Suppression de plusieurs documents
const removeManyPeople = (done) => {
  const nameToRemove = 'Mary';

  Person.remove({ name: nameToRemove }, (err, result) => {
    if (err) return done(err);
    done(null, result);
  });
};

// Recherche avancée avec tri, limite et sélection
const queryChain = (done) => {
  const foodToSearch = 'burritos';

  Person.find({ favoriteFoods: foodToSearch })
    .sort('name')
    .limit(2)
    .select('-age')
    .exec((err, data) => {
      if (err) return done(err);
      done(null, data);
    });
};

// Export des fonctions (optionnel pour les tests ou l'intégration avec d'autres modules)
module.exports = {
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain,
};
