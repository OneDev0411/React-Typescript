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

export function findTimeConflicts(
  slots: IShowingAvailabilityInput[]
): { slot1Index: number; slot2Index: number } | false {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const slot1 = slots[i]
      const slot2 = slots[j]

      if (slot1.weekday === slot2.weekday) {
        if (
          (slot1.availability[0] >= slot2.availability[0] &&
            slot1.availability[0] < slot2.availability[1]) ||
          (slot2.availability[0] >= slot1.availability[0] &&
            slot2.availability[0] < slot1.availability[1])
        ) {
          return {
            slot1Index: i,
            slot2Index: j
          }
        }
      }
    }
  }

  return false
}

export function hasInvalidTimeRange(
  slots: IShowingAvailabilityInput[]
): boolean {
  return !!slots.find(slot => slot.availability[1] <= slot.availability[0])
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
