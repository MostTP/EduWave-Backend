const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required'],
    index: true,
  },
  progress: {
    type: Number,
    default: 0,
    min: [0, 'Progress cannot be negative'],
    max: [100, 'Progress cannot exceed 100'],
  },
  completedLessons: [{
    type: Number, // Index of completed lesson
  }],
  currentLesson: {
    type: Number,
    default: 0,
    min: [0, 'Current lesson cannot be negative'],
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Compound index to ensure one progress record per user per course
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Method to update progress
courseProgressSchema.methods.updateProgress = function(completedLessonsCount, totalLessons) {
  this.completedLessons = Array.from({ length: completedLessonsCount }, (_, i) => i);
  this.progress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
  this.lastAccessedAt = Date.now();
  
  if (this.progress === 100 && !this.completedAt) {
    this.completedAt = Date.now();
  }
  
  return this.save();
};

module.exports = mongoose.model('CourseProgress', courseProgressSchema);

