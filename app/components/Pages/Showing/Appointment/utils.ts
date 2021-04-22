const APPOINTMENT_STATUS_LABEL_MAP: Record<
  IShowingAppointmentStatus,
  string
> = {
  Requested: 'Requested',
  Confirmed: 'Confirmed',
  NeedsRescheduling: 'Needs Rescheduling',
  Rescheduled: 'Rescheduled',
  Cancelled: 'Cancelled',
  Finished: 'Completed'
}

export function getAppointmentStatusLabel(
  appointment: IShowingAppointment | IPublicShowingAppointment
): string {
  return APPOINTMENT_STATUS_LABEL_MAP[appointment.status]
}
