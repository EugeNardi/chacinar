'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, X, Check } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export default function Notifications({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    
    // Suscribirse a nuevas notificaciones en tiempo real
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function loadNotifications() {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    }
  }

  async function markAsRead(notificationId: string) {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    loadNotifications();
  }

  async function markAllAsRead() {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    loadNotifications();
  }

  async function deleteNotification(notificationId: string) {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    loadNotifications();
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-apple hover:bg-neutral-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-neutral-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-brand text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {showPanel && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-apple shadow-xl border border-neutral-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notificaciones
                {unreadCount > 0 && (
                  <Badge variant="danger" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </h3>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Marcar todas
                </Button>
              )}
            </div>

            {/* Lista de notificaciones */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-neutral-600">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
                  <p>No tienes notificaciones</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-neutral-50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-neutral-900 text-sm">
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="flex-shrink-0 text-neutral-400 hover:text-neutral-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-neutral-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-neutral-500">
                              {new Date(notification.created_at).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-brand hover:text-brand-dark font-medium"
                              >
                                Marcar como leída
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
