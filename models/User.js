const { default: mongoose } = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    name: {type: String},
    sets: {type: Number, min: 0},
    reps: {type: Number, min:0},
    weight: {type: Number, min:0, max:1000},
}, {timestamps: true})

const routineSchema = new mongoose.Schema({
    name: {type: String},
    exercises: [exerciseSchema],
    day: [String],
}, {timestamps: true})

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    firstName: String,
    lastName: String,
    dob: Date,
    bodyWeight: Number,
    routines: [routineSchema],

}, {timestamps: true})

const User = mongoose.model("User", userSchema);
const Routine = mongoose.model("Routine", routineSchema)
const Exercise = mongoose.model("Exercise", exerciseSchema)

module.exports = {User, Routine, Exercise};