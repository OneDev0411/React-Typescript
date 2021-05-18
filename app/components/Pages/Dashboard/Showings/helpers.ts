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
  return `${config.showing?.booking_url || config.app.url}/showings/${
    showing.slug
  }-${showing.human_readable_id}/book`
}
