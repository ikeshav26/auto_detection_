import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['alert', 'warning', 'info'],
        default: 'alert'
    },
    snapshot: {
        type: String,
        required: false
    },
    peopleCount: {
        type: Number,
        default: 0
    },
    fanStatus: {
        type: Boolean,
        default: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
