const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Workout = require('../models/Workout');

// ─── Workout Exercise Library ───────────────────────────────────────────────
const exerciseLibrary = {

  'weight loss': {
    beginner: {
      none: [
        { name: 'Jumping Jacks',      sets: '3', reps: '30 sec', rest: '15 sec' },
        { name: 'Bodyweight Squats',  sets: '3', reps: '15',     rest: '30 sec' },
        { name: 'High Knees',         sets: '3', reps: '30 sec', rest: '15 sec' },
        { name: 'Push-Ups (Knee)',     sets: '3', reps: '10',     rest: '30 sec' },
        { name: 'Mountain Climbers',  sets: '3', reps: '20 sec', rest: '20 sec' },
      ],
      dumbbells: [
        { name: 'Dumbbell Squat',     sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Dumbbell Swing',     sets: '3', reps: '15',     rest: '30 sec' },
        { name: 'Alternating Lunges', sets: '3', reps: '10 each',rest: '30 sec' },
        { name: 'Dumbbell Row',       sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Jumping Jacks',      sets: '3', reps: '30 sec', rest: '15 sec' },
      ],
      'resistance bands': [
        { name: 'Band Pull Apart',    sets: '3', reps: '15',     rest: '30 sec' },
        { name: 'Band Squat',         sets: '3', reps: '15',     rest: '30 sec' },
        { name: 'Band Row',           sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Band Kickback',      sets: '3', reps: '12 each',rest: '30 sec' },
        { name: 'High Knees',         sets: '3', reps: '30 sec', rest: '15 sec' },
      ],
    },
    intermediate: {
      none: [
        { name: 'Burpees',            sets: '4', reps: '10',     rest: '30 sec' },
        { name: 'Jump Squats',        sets: '4', reps: '15',     rest: '20 sec' },
        { name: 'Push-Ups',           sets: '4', reps: '15',     rest: '30 sec' },
        { name: 'Mountain Climbers',  sets: '4', reps: '40 sec', rest: '20 sec' },
        { name: 'Plank',              sets: '3', reps: '45 sec', rest: '20 sec' },
      ],
      dumbbells: [
        { name: 'Dumbbell Thruster',  sets: '4', reps: '12',     rest: '30 sec' },
        { name: 'Renegade Row',       sets: '4', reps: '10 each',rest: '30 sec' },
        { name: 'Dumbbell Deadlift',  sets: '4', reps: '12',     rest: '30 sec' },
        { name: 'Dumbbell Press',     sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Jump Squats',        sets: '3', reps: '15',     rest: '20 sec' },
      ],
      'resistance bands': [
        { name: 'Band Deadlift',      sets: '4', reps: '15',     rest: '30 sec' },
        { name: 'Band Push-Up',       sets: '4', reps: '12',     rest: '30 sec' },
        { name: 'Band Sprint',        sets: '4', reps: '30 sec', rest: '20 sec' },
        { name: 'Band Lateral Walk',  sets: '3', reps: '20 each',rest: '30 sec' },
        { name: 'Mountain Climbers',  sets: '3', reps: '40 sec', rest: '20 sec' },
      ],
    },
    advanced: {
      none: [
        { name: 'Burpee Pull-Ups',    sets: '5', reps: '8',      rest: '30 sec' },
        { name: 'Pistol Squats',      sets: '4', reps: '8 each', rest: '30 sec' },
        { name: 'Plyometric Push-Ups',sets: '4', reps: '12',     rest: '30 sec' },
        { name: 'Sprint Intervals',   sets: '5', reps: '30 sec', rest: '15 sec' },
        { name: 'Hollow Body Hold',   sets: '4', reps: '45 sec', rest: '20 sec' },
      ],
      dumbbells: [
        { name: 'Dumbbell Complex',   sets: '5', reps: '8',      rest: '30 sec' },
        { name: 'Single-Leg DL',      sets: '4', reps: '10 each',rest: '30 sec' },
        { name: 'Arnold Press',       sets: '4', reps: '12',     rest: '30 sec' },
        { name: 'DB Push-Press',      sets: '4', reps: '10',     rest: '30 sec' },
        { name: 'Plyometric Push-Ups',sets: '4', reps: '12',     rest: '20 sec' },
      ],
      'resistance bands': [
        { name: 'Band Pallof Press',  sets: '4', reps: '12 each',rest: '30 sec' },
        { name: 'Band Face Pull',     sets: '4', reps: '15',     rest: '30 sec' },
        { name: 'Band Squat Jump',    sets: '4', reps: '15',     rest: '20 sec' },
        { name: 'Band Woodchop',      sets: '4', reps: '12 each',rest: '30 sec' },
        { name: 'Sprint Intervals',   sets: '5', reps: '30 sec', rest: '15 sec' },
      ],
    },
  },

  'muscle gain': {
    beginner: {
      none: [
        { name: 'Push-Ups',           sets: '3', reps: '10',     rest: '60 sec' },
        { name: 'Bodyweight Squats',  sets: '3', reps: '15',     rest: '60 sec' },
        { name: 'Glute Bridge',       sets: '3', reps: '15',     rest: '45 sec' },
        { name: 'Tricep Dips (Chair)',sets: '3', reps: '10',     rest: '60 sec' },
        { name: 'Plank',              sets: '3', reps: '30 sec', rest: '45 sec' },
      ],
      dumbbells: [
        { name: 'Dumbbell Curl',      sets: '3', reps: '12',     rest: '60 sec' },
        { name: 'Dumbbell Press',     sets: '3', reps: '10',     rest: '60 sec' },
        { name: 'Goblet Squat',       sets: '3', reps: '12',     rest: '60 sec' },
        { name: 'Dumbbell Row',       sets: '3', reps: '10 each',rest: '60 sec' },
        { name: 'DB Lateral Raise',   sets: '3', reps: '12',     rest: '60 sec' },
      ],
      'resistance bands': [
        { name: 'Band Bicep Curl',    sets: '3', reps: '15',     rest: '60 sec' },
        { name: 'Band Chest Press',   sets: '3', reps: '12',     rest: '60 sec' },
        { name: 'Band Squat',         sets: '3', reps: '15',     rest: '60 sec' },
        { name: 'Band Row',           sets: '3', reps: '12',     rest: '60 sec' },
        { name: 'Band Overhead Press',sets: '3', reps: '12',     rest: '60 sec' },
      ],
    },
    intermediate: {
      none: [
        { name: 'Diamond Push-Ups',   sets: '4', reps: '12',     rest: '60 sec' },
        { name: 'Bulgarian Split Sq.',sets: '4', reps: '10 each',rest: '60 sec' },
        { name: 'Pike Push-Ups',      sets: '4', reps: '10',     rest: '60 sec' },
        { name: 'Single-Leg Glute Br.',sets:'4', reps: '12 each',rest: '60 sec' },
        { name: 'L-Sit (Chair)',       sets: '3', reps: '20 sec', rest: '60 sec' },
      ],
      dumbbells: [
        { name: 'DB Shoulder Press',  sets: '4', reps: '10',     rest: '60 sec' },
        { name: 'DB Romanian DL',     sets: '4', reps: '10',     rest: '60 sec' },
        { name: 'DB Hammer Curl',     sets: '4', reps: '12',     rest: '60 sec' },
        { name: 'DB Skull Crusher',   sets: '4', reps: '12',     rest: '60 sec' },
        { name: 'Renegade Row',       sets: '4', reps: '8 each', rest: '60 sec' },
      ],
      'resistance bands': [
        { name: 'Band Deadlift',      sets: '4', reps: '15',     rest: '60 sec' },
        { name: 'Band Tricep Pushdown',sets:'4', reps: '15',     rest: '60 sec' },
        { name: 'Band Bicep Curl',    sets: '4', reps: '15',     rest: '60 sec' },
        { name: 'Band Hip Thrust',    sets: '4', reps: '15',     rest: '60 sec' },
        { name: 'Band Overhead Press',sets: '4', reps: '12',     rest: '60 sec' },
      ],
    },
    advanced: {
      none: [
        { name: 'One-Arm Push-Up',    sets: '4', reps: '6 each', rest: '90 sec' },
        { name: 'Pistol Squat',       sets: '4', reps: '8 each', rest: '90 sec' },
        { name: 'Handstand Push-Up',  sets: '4', reps: '6',      rest: '90 sec' },
        { name: 'Dragon Flag',        sets: '3', reps: '6',      rest: '90 sec' },
        { name: 'Archer Push-Up',     sets: '4', reps: '8 each', rest: '60 sec' },
      ],
      dumbbells: [
        { name: 'DB Floor Press',     sets: '5', reps: '8',      rest: '90 sec' },
        { name: 'DB Romanian DL',     sets: '5', reps: '8',      rest: '90 sec' },
        { name: 'DB Pullover',        sets: '4', reps: '10',     rest: '60 sec' },
        { name: 'DB Z Press',         sets: '4', reps: '8',      rest: '90 sec' },
        { name: 'Suitcase Carry',     sets: '4', reps: '40 sec', rest: '60 sec' },
      ],
      'resistance bands': [
        { name: 'Band Pull-Up Assist',sets: '5', reps: '8',      rest: '90 sec' },
        { name: 'Band Good Morning',  sets: '4', reps: '15',     rest: '60 sec' },
        { name: 'Band Chest Fly',     sets: '4', reps: '15',     rest: '60 sec' },
        { name: 'Band Squat + Press', sets: '4', reps: '12',     rest: '60 sec' },
        { name: 'Band Pallof Press',  sets: '4', reps: '12 each',rest: '60 sec' },
      ],
    },
  },

  'general fitness': {
    beginner: {
      none: [
        { name: 'Marching in Place',  sets: '3', reps: '30 sec', rest: '15 sec' },
        { name: 'Bodyweight Squats',  sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Wall Push-Ups',      sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Standing Side Bend', sets: '3', reps: '10 each',rest: '20 sec' },
        { name: 'Plank (Knees)',      sets: '3', reps: '20 sec', rest: '30 sec' },
      ],
      dumbbells: [
        { name: 'DB Squat',           sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'DB Curl',            sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'DB Shoulder Press',  sets: '3', reps: '10',     rest: '30 sec' },
        { name: 'DB Row',             sets: '3', reps: '10 each',rest: '30 sec' },
        { name: 'Standing Side Bend', sets: '3', reps: '10 each',rest: '20 sec' },
      ],
      'resistance bands': [
        { name: 'Band Squat',         sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Band Row',           sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Band Curl',          sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Band Overhead Press',sets: '3', reps: '10',     rest: '30 sec' },
        { name: 'Band Hip Hinge',     sets: '3', reps: '12',     rest: '30 sec' },
      ],
    },
    intermediate: {
      none: [
        { name: 'Push-Ups',           sets: '3', reps: '15',     rest: '30 sec' },
        { name: 'Jump Squats',        sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Reverse Lunges',     sets: '3', reps: '10 each',rest: '30 sec' },
        { name: 'Plank',              sets: '3', reps: '40 sec', rest: '30 sec' },
        { name: 'Superman Hold',      sets: '3', reps: '30 sec', rest: '20 sec' },
      ],
      dumbbells: [
        { name: 'DB Deadlift',        sets: '3', reps: '12',     rest: '45 sec' },
        { name: 'DB Push Press',      sets: '3', reps: '10',     rest: '45 sec' },
        { name: 'DB Reverse Lunge',   sets: '3', reps: '10 each',rest: '45 sec' },
        { name: 'DB Renegade Row',    sets: '3', reps: '8 each', rest: '45 sec' },
        { name: 'DB Curl to Press',   sets: '3', reps: '10',     rest: '45 sec' },
      ],
      'resistance bands': [
        { name: 'Band Deadlift',      sets: '3', reps: '15',     rest: '30 sec' },
        { name: 'Band Lateral Walk',  sets: '3', reps: '15 each',rest: '30 sec' },
        { name: 'Band Press',         sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Band High Row',      sets: '3', reps: '12',     rest: '30 sec' },
        { name: 'Band Clamshell',     sets: '3', reps: '15 each',rest: '30 sec' },
      ],
    },
    advanced: {
      none: [
        { name: 'Burpees',            sets: '4', reps: '12',     rest: '30 sec' },
        { name: 'Pistol Squat',       sets: '4', reps: '6 each', rest: '45 sec' },
        { name: 'Plyometric Push-Ups',sets: '4', reps: '10',     rest: '30 sec' },
        { name: 'Plank to Downdog',   sets: '4', reps: '10',     rest: '30 sec' },
        { name: 'Jump Lunges',        sets: '4', reps: '12 each',rest: '30 sec' },
      ],
      dumbbells: [
        { name: 'DB Snatch',          sets: '4', reps: '8 each', rest: '45 sec' },
        { name: 'DB Front Squat',     sets: '4', reps: '10',     rest: '45 sec' },
        { name: 'DB Romanian DL',     sets: '4', reps: '10',     rest: '45 sec' },
        { name: 'DB Push Press',      sets: '4', reps: '8',      rest: '45 sec' },
        { name: 'DB Turkish Get-Up',  sets: '3', reps: '3 each', rest: '60 sec' },
      ],
      'resistance bands': [
        { name: 'Band Squat Jump',    sets: '4', reps: '12',     rest: '30 sec' },
        { name: 'Band Woodchop',      sets: '4', reps: '12 each',rest: '30 sec' },
        { name: 'Band Face Pull',     sets: '4', reps: '15',     rest: '30 sec' },
        { name: 'Band Pallof Press',  sets: '4', reps: '12 each',rest: '30 sec' },
        { name: 'Band Hip Thrust',    sets: '4', reps: '15',     rest: '30 sec' },
      ],
    },
  },
};

// Trim exercises based on duration
function getExerciseCount(duration) {
  if (duration <= 15) return 3;
  if (duration <= 30) return 4;
  return 5;
}

// Generate workout
router.post('/generate', authMiddleware, (req, res) => {
  const { goal, experienceLevel, duration, equipment } = req.body;

  // Normalize inputs
  const g = (goal || 'general fitness').toLowerCase();
  const e = (experienceLevel || 'beginner').toLowerCase();
  const eq = (equipment || 'none').toLowerCase();
  const dur = parseInt(duration) || 30;

  // Look up exercises
  const goalData = exerciseLibrary[g] || exerciseLibrary['general fitness'];
  const levelData = goalData[e] || goalData['beginner'];
  const allExercises = levelData[eq] || levelData['none'];

  const count = getExerciseCount(dur);
  const exercises = allExercises.slice(0, count);

  res.json({ exercises, goal: g, experienceLevel: e, duration: dur, equipment: eq });
});

// Save workout
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { goal, experienceLevel, duration, equipment, exercises } = req.body;
    const workout = await Workout.create({
      userId: req.userId,
      goal, experienceLevel, duration, equipment, exercises
    });
    res.json({ message: 'Workout saved!', workout });
  } catch (err) {
    res.status(500).json({ message: 'Error saving workout' });
  }
});

// Get user's saved workouts
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(10);
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching workouts' });
  }
});

module.exports = router;
