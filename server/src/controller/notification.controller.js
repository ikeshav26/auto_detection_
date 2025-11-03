import Notification from '../models/notification.model.js';


export const createNotification = async (req, res) => {
    try {
        const { message, type, snapshot, peopleCount, fanStatus } = req.body;
        
        const notification = new Notification({
            message,
            type: type || 'alert',
            snapshot,
            peopleCount: peopleCount || 0,
            fanStatus: fanStatus || false
        });

        await notification.save();
        
        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating notification',
            error: error.message
        });
    }
};


export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(50); 
        
        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};


export const getUnreadNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ isRead: false })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching unread notifications',
            error: error.message
        });
    }
};


export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating notification',
            error: error.message
        });
    }
};


export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating notifications',
            error: error.message
        });
    }
};


export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        
        const notification = await Notification.findByIdAndDelete(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};


export const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({});
        
        res.status(200).json({
            success: true,
            message: 'All notifications deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting notifications',
            error: error.message
        });
    }
};
