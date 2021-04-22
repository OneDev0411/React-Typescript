const APPOINTMENT_STATUS_LABEL_MAP: Record<
  IShowingAppointmentStatus,
  string
> = {
  Requested: 'Requested',
  Confirmed: 'Confirmed',
  Rescheduled: 'Rescheduled',
  Canceled: 'Canceled',
  Completed: 'Completed'
}

export function getAppointmentStatusLabel(
  appointment: IShowingAppointment | IPublicShowingAppointment
): string {
  return APPOINTMENT_STATUS_LABEL_MAP[appointment.status]
}
