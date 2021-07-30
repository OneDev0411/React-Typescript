interface UseAppointmentMessageReadStatus {
  isMessageRead: boolean
  notificationId: Nullable<UUID>
}

function useAppointmentMessageReadStatus(
  notifications: Nullable<INotification[]>
): UseAppointmentMessageReadStatus {
  const notification = notifications?.find(notification =>
    ['Rescheduled', 'Canceled'].includes(notification.action)
  )

  return {
    isMessageRead: !notification,
    notificationId: notification?.id ?? null
  }
}

export default useAppointmentMessageReadStatus
