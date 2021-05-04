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
