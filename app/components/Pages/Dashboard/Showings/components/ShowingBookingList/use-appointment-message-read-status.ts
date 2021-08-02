interface UseAppointmentMessageReadStatus {
  isMessageRead: boolean
  notificationIds: UUID[]
}

function useAppointmentMessageReadStatus(
  notifications: Nullable<INotification[]>
): UseAppointmentMessageReadStatus {
  const notificationIds: UUID[] =
    notifications
      ?.filter(notification =>
        ['Rescheduled', 'Canceled'].includes(notification.action)
      )
      .map(notification => notification.id) ?? []

  return {
    isMessageRead: notificationIds.length === 0,
    notificationIds
  }
}

export default useAppointmentMessageReadStatus
