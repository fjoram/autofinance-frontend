import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

let idCounter = 0;

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const dismiss = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const notify = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++idCounter;
        setNotifications(prev => [...prev, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => dismiss(id), duration);
        }
        return id;
    }, [dismiss]);

    const success = useCallback((msg, duration) => notify(msg, 'success', duration), [notify]);
    const error   = useCallback((msg, duration) => notify(msg, 'error',   duration), [notify]);
    const warning = useCallback((msg, duration) => notify(msg, 'warning', duration), [notify]);
    const info    = useCallback((msg, duration) => notify(msg, 'info',    duration), [notify]);

    return (
        <NotificationContext.Provider value={{ notifications, notify, success, error, warning, info, dismiss }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotification must be used inside NotificationProvider');
    return ctx;
}
