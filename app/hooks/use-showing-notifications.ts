import { useEffect } from 'react'

interface UseShowingNotificationsProps {
  onShowingAppointment?: (notification: INotification) => void
}

function useShowingNotifications({
  onShowingAppointment
}: UseShowingNotificationsProps) {
  const { socket } = window

  useEffect(() => {
    function handleNewNotification(notification) {
      if (notification.object_class === 'ShowingAppointment') {
        onShowingAppointment?.(notification)
      }
    }

    socket.on('Notification', handleNewNotification)

    return () => {
      socket.off('Notification', handleNewNotification)
    }
  }, [socket, onShowingAppointment])
}

export default useShowingNotifications
