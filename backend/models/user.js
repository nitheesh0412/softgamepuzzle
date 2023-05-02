const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  timeSpent: [{ type: Number, default: 0 }],
  wrongAnswers: [{ type: Number, default: 0 }],
  date: { type: Date, default: Date.now },
  timeslide : [{type : Number, default : 0}],
  noofmoves : [{type : Number, default : 0}],

});


module.exports = mongoose.model('User', UserSchema);
