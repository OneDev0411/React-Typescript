import { useEffect } from 'react'

interface UseShowingNotificationsProps {
  onShowingAppointmentCreated?: (notification: INotification) => void
  onShowingAppointmentRescheduled?: (notification: INotification) => void
  onShowingAppointmentCanceled?: (notification: INotification) => void
}

function useShowingNotifications({
  onShowingAppointmentCreated,
  onShowingAppointmentRescheduled,
  onShowingAppointmentCanceled
}: UseShowingNotificationsProps) {
  const { socket } = window

  useEffect(() => {
    function handleNewNotification(notification) {
      if (notification.object_class === 'ShowingAppointment') {
        switch (notification.action) {
          case 'Created':
            onShowingAppointmentCreated?.(notification)

            return
          case 'Rescheduled':
            onShowingAppointmentRescheduled?.(notification)

            return
          case 'Canceled':
            onShowingAppointmentCanceled?.(notification)

            return
        }
      }

      console.log('ShowingAppointment::notification', notification)
    }

    socket.on('Notification', handleNewNotification)

    return () => {
      socket.off('Notification', handleNewNotification)
    }
  }, [
    socket,
    onShowingAppointmentCreated,
    onShowingAppointmentRescheduled,
    onShowingAppointmentCanceled
  ])
}

export default useShowingNotifications
