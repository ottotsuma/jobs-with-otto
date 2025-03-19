'use client';
// /pages/notifications.js

import { useState, useEffect } from 'react';
import { getNotifications, markAsRead } from '@API/notifications';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await getNotifications(); // Assume function to fetch notifications
            setNotifications(res.data);
        }
        fetchData();
    }, []);

    const handleMarkAsRead = async (id) => {
        await markAsRead(id); // Assume function to mark as read
        setNotifications(notifications.map(notification => notification.id === id ? { ...notification, is_read: true } : notification));
    };

    return (
        <div>
            <h1>Your Notifications</h1>
            {notifications.map(notification => (
                <div key={notification.id}>
                    <p>{notification.message}</p>
                    <button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</button>
                </div>
            ))}
        </div>
    );
}
