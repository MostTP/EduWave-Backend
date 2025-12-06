const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  checkStudyPlannerReminders,
} = require('../controllers/notificationController');

// All routes require authentication
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.post('/', createNotification);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);
router.post('/check-reminders', async (req, res) => {
  // Manual trigger for study planner reminders (can be called by cron job)
  const result = await checkStudyPlannerReminders();
  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = router;

