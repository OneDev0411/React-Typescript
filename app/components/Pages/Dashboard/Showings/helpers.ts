import { format } from 'fecha'

import Deal from 'models/Deal'
import config from 'config'

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

export function sortAppointments(
  appointments: IShowingAppointment[]
): IShowingAppointment[] {
  return [...appointments].sort((a, b) => {
    const time1 = new Date(a.time)
    const time2 = new Date(b.time)

    if (time1 > time2) {
      return -1
    }

    if (time1 < time2) {
      return 1
    }

    return 0
  })
}

export function getShowingRoleLabel(role: IDealRoleType): string {
  switch (role) {
    case 'SellerAgent':
      return 'Agent'

    case 'CoSellerAgent':
      return 'Co-Agent'

    case 'Tenant':
      return 'Occupant'

    default:
      return role
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

export function getAppointmentTitle(appointment: IShowingAppointment): string {
  return [
    (appointment.showing as IShowing).title,
    ' — ',
    getAppointmentDateLabel(appointment.time, 'MMMM DD'),
    ', ',
    getAppointmentTimeLabel(
      appointment.time,
      (appointment.showing as IShowing).duration
    )
  ].join('')
}
