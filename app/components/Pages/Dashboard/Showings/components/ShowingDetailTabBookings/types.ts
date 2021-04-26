import type { ReactNode } from 'react'

export type AppointmentFilter = 'All' | IAppointmentStatus | 'Feedback'

export interface AppointmentFilterInfo {
  label: string
  icon: ReactNode
  filter?: (appointments: IShowingAppointment[]) => IShowingAppointment[]
}
