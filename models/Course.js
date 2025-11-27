const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Lesson duration is required'],
    min: [0, 'Duration must be positive'],
  },
  totallesson: {
    type: Number,
    required: [true, 'Total lesson number is required'],
    min: [1, 'Total lesson must be at least 1'],
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true,
  },
}, { _id: true });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  desc: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
  },
  lessons: {
    type: [lessonSchema],
    default: [],
  },
  courseduration: {
    type: Number, // Total course duration in minutes
    required: [true, 'Course duration is required'],
    min: [0, 'Course duration must be positive'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', courseSchema);

