const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: String,
  experienceLevel: String,
  duration: Number,
  equipment: String,
  exercises: [
    {
      name: String,
      sets: String,
      reps: String,
      rest: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
