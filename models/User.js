//In computer programming, a schema is the organization or structure for a database. The activity of data modeling leads to a schema. 
//(The plural form is schemata.

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({// Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents (the keys) within that collection.
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', UserSchema); //A Model is a class that's your primary tool for interacting with MongoDB. An instance of a Model is called a Document.

module.exports = User;