import { format } from 'fecha'

import { getIndexOfWeekday } from '@app/utils/weekday'
import config from 'config'
import Deal from 'models/Deal'

import { showingsTabs } from './constants'
import { AppointmentFilter } from './types'

export function hourToSeconds(hour: number) {
  return hour * 60 * 60
}

export const generateAppointmentFilterLink = (filter: AppointmentFilter) =>
  `/dashboard/showings/${showingsTabs.Bookings}?filter=${filter}`

const defaultShowingImageUrl = '/static/images/deals/group-146.svg'

export function getShowingImage({
  deal,
  listing
}: Pick<IShowing, 'deal' | 'listing'>): string {
  return (
    Deal.get.field(deal, 'photo') ||
    (listing?.gallery_image_urls?.length && listing?.gallery_image_urls[0]) ||
    defaultShowingImageUrl
  )
}

export const splitFullName = (fullName: string) => {
  const [first_name, ...others] = fullName.split(' ')

  return {
    first_name: first_name || '',
    last_name: others.join(' ')
  }
}

export function getFullAddressFromSrdAddr(stdAddr: IStdAddr): string {
  return [
    stdAddr.house_num,
    stdAddr.name,
    stdAddr.suftype,
    stdAddr.city,
    stdAddr.state,
    stdAddr.postcode
  ].join(' ')
}

export function getShowingBookingPageUrl(
  showing: Pick<IShowing, 'slug' | 'human_readable_id'>
): string {
  return `${config.showing?.booking_url || window.location.origin}/showings/${
    showing.slug
  }-${showing.human_readable_id}/book`
}

function isTimeSlotsConflict(
  slot1: IShowingAvailabilityInput,
  slot2: IShowingAvailabilityInput
) {
  if (slot1.weekday === slot2.weekday) {
    if (
      (slot1.availability[0] >= slot2.availability[0] &&
        slot1.availability[0] < slot2.availability[1]) ||
      (slot2.availability[0] >= slot1.availability[0] &&
        slot2.availability[0] < slot1.availability[1])
    ) {
      return true
    }
  }

  return false
}

export function hasTimeConflicts(slots: IShowingAvailabilityInput[]): boolean {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (isTimeSlotsConflict(slots[i], slots[j])) {
        return true
      }
    }
  }

  return false
}

export function findTimeConflicts(
  slots: IShowingAvailabilityInput[]
): number[] {
  const results: number[] = []

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (isTimeSlotsConflict(slots[i], slots[j])) {
        results.push(i)
        results.push(j)
      }
    }
  }

  return [...new Set(results)]
}

export function hasInvalidTimeRange(
  slots: IShowingAvailabilityInput[],
  showingDuration: number
): boolean {
  return !!slots.find(
    slot =>
      slot.availability[1] <= slot.availability[0] ||
      slot.availability[1] - slot.availability[0] < showingDuration
  )
}

function compareDateDESC(date1: Date, date2: Date): number {
  return date2.getTime() - date1.getTime()
}

export function sortAppointments(
  appointments: IShowingAppointment<'showing'>[]
): IShowingAppointment<'showing'>[] {
  const sortedAppointmentsByTime = [...appointments].sort((a, b) => {
    const time1 = new Date(a.time)
    const time2 = new Date(b.time)

    return compareDateDESC(time1, time2)
  })

  const pastAppointments: IShowingAppointment<'showing'>[] = []
  const upcomingAppointments: IShowingAppointment<'showing'>[] = []

  const currentTime = new Date()

  sortedAppointmentsByTime.forEach(appointment => {
    if (compareDateDESC(new Date(appointment.time), currentTime) <= 0) {
      // Upcoming appointments should sort ASC, so I use unshift instead of push
      upcomingAppointments.unshift(appointment)
    } else {
      pastAppointments.push(appointment)
    }
  })

  return [...upcomingAppointments, ...pastAppointments]
}

export function getShowingRoleLabel(role: IDealRoleType): string {
  switch (role) {
    case 'Admin/Assistant':
      return 'Admin/Assistant'

    case 'SellerAgent':
      return 'Agent'

    case 'CoSellerAgent':
      return 'Co-Agent'

    case 'Tenant':
      return 'Occupant'

    default:
      return 'Other'
  }
}

export function getShowingRoleAOrAn(role: IDealRoleType): string {
  switch (role) {
    case 'Admin/Assistant':
      return 'an'

    case 'SellerAgent':
      return 'an'

    case 'CoSellerAgent':
      return 'a'

    case 'Tenant':
      return 'an'

    default:
      return 'an'
  }
}

// TODO: use standard date format if exists
const dateFormat = 'MMM D, ddd'

const todayDate = new Date()
const todayLabel = format(todayDate, dateFormat)
const tomorrowLabel = format(
  todayDate.setDate(todayDate.getDate() + 1),
  dateFormat
)

export function getAppointmentDateLabel(
  appointmentTime: string,
  customDateFormat: string = dateFormat
): string {
  const time = new Date(appointmentTime)
  const timeLabel = format(time, customDateFormat)

  switch (timeLabel) {
    case todayLabel:
      return 'Today'
    case tomorrowLabel:
      return 'Tomorrow'
    default:
      return timeLabel.toUpperCase()
  }
}

export function getAppointmentTimeLabel(
  appointmentTime: string,
  duration: number
): string {
  const timeFormat = 'h:mm'
  const startTime = new Date(appointmentTime)
  const endTime = new Date(startTime.getTime() + duration * 1000)

  return `${format(startTime, timeFormat)} — ${format(
    endTime,
    `${timeFormat}a`
  )}`
}

export function getAppointmentTitle(
  appointment: IShowingAppointment<'showing'>
): string {
  return [
    appointment.showing.title,
    ' — ',
    getAppointmentDateLabel(appointment.time, 'MMMM DD'),
    ', ',
    getAppointmentTimeLabel(appointment.time, appointment.showing.duration)
  ].join('')
}

export function sortShowingAvailabilities<T extends IShowingAvailabilityInput>(
  availabilities: T[]
): T[] {
  return [...availabilities].sort((time1, time2) => {
    const time1WeekdayIndex = getIndexOfWeekday(time1.weekday)
    const time2WeekdayIndex = getIndexOfWeekday(time2.weekday)

    if (time1WeekdayIndex < time2WeekdayIndex) {
      return -1
    }

    if (time1WeekdayIndex > time2WeekdayIndex) {
      return 1
    }

    // I'm sure the date ranges do not have any conflicts because of the
    // available validations on the form. So I relied on this fact and just
    // use the start value of the range for doing the comparison.
    if (time1.availability[0] < time2.availability[0]) {
      return -1
    }

    if (time1.availability[0] > time2.availability[0]) {
      return 1
    }

    return 0
  })
}
