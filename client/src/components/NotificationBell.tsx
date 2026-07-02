import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markOneRead,
} from '../services/notification.service'
import { formatRelativeTime } from '../utils/formatRelativeTime'

const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const { data: unreadData } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: getUnreadCount,
    refetchInterval: 30000, // poll every 30 seconds
  })

  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    enabled: open,
  })

  const markAllMutation = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const handleNotificationClick = async (notification: any) => {
    setOpen(false)
    if (notification.link) navigate(notification.link)
    try {
      await markOneRead(notification.id)
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    } catch {
      // Non-critical — the notification stays unread and will show correctly next time
    }
  }

  const unreadCount = unreadData?.count ?? 0

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_FOLLOWER': return '👤'
      case 'NEW_LIKE':     return '❤️'
      case 'NEW_COMMENT':  return '💬'
      case 'NEW_CHAPTER':  return '📖'
      default:             return '🔔'
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
        aria-expanded={open}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                disabled={markAllMutation.isPending}
                className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs transition-colors"
              >
                {markAllMutation.isPending ? 'Marking...' : 'Mark all read'}
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notificationsLoading ? (
              <div className="p-2 space-y-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 px-2 py-3 animate-pulse">
                    <div className="w-5 h-5 rounded-full bg-gray-800 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-800 rounded w-full" />
                      <div className="h-2.5 bg-gray-800 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notificationsError ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Couldn't load notifications. Try again later.
              </div>
            ) : !notifications || notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((n: any) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left border-b border-gray-800/50 last:border-0 ${
                    !n.read ? 'bg-indigo-500/5' : ''
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{getIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-xs leading-relaxed">{n.message}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 mt-1" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
