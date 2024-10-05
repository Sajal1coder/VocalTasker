// models/User.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, { _id: true, timestamps: true });

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tasks: [TaskSchema], // Embedding tasks
});


module.exports = mongoose.model('User', UserSchema);
