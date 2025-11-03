import express from 'express';
import {
    createNotification,
    getAllNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
} from '../controller/notification.controller.js';


const router = express.Router();


router.post('/create', createNotification);
router.get('/', getAllNotifications);
router.get('/unread', getUnreadNotifications);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);
router.delete('/', deleteAllNotifications);


export default router;
