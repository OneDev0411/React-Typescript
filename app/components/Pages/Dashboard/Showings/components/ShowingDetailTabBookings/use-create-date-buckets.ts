import { getAppointmentTimeLabel } from './helpers'

interface DateBucket {
  label: string
  appointments: IShowingAppointment[]
}
function useCreateDateBuckets(
  appointments: IShowingAppointment[]
): DateBucket[] {
  const sortedAppointments = [...appointments].sort((a, b) => {
    const time1 = new Date(a.time)
    const time2 = new Date(b.time)

    if (time1 < time2) {
      return -1
    }

    if (time1 > time2) {
      return 1
    }

    return 0
  })

  const buckets: DateBucket[] = []

  let lastBucket: DateBucket | null = null

  sortedAppointments.forEach(appointment => {
    const label = getAppointmentTimeLabel(appointment.time)

    if (lastBucket?.label !== label) {
      if (lastBucket) {
        buckets.push(lastBucket)
      }

      lastBucket = {
        label,
        appointments: []
      }
    }

    lastBucket.appointments.push(appointment)
  })

  if (lastBucket) {
    buckets.push(lastBucket)
  }

  return buckets
}

export default useCreateDateBuckets
