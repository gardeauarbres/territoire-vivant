"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast, NotificationType } from "@/components/ui/Toast";
import { AnimatePresence } from "framer-motion";

interface Notification {
    id: string;
    title: string;
    message?: string;
    type: NotificationType;
}

interface NotificationContextType {
    showNotification: (title: string, message?: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((title: string, message?: string, type: NotificationType = "info") => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications((prev) => [...prev, { id, title, message, type }]);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}

            {/* Toast Container - Fixed Position */}
            <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 p-4 pointer-events-none">
                <AnimatePresence>
                    {notifications.map((n) => (
                        <Toast
                            key={n.id}
                            id={n.id}
                            title={n.title}
                            message={n.message}
                            type={n.type}
                            onClose={removeNotification}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
}
