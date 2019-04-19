import {
  getField as getDealfield,
  getStatus as getDealStatus,
  getAddress as getDealAddress
} from 'models/Deal/helpers/context'
import { getListingAddress, getStatusColor } from 'utils/listing'

/**
 * Normalizing associations
 * @param {array} associations The associations
 * @returns {object} a normalized object of associations
 */
export function normalizeAssociations(associations) {
  return associations.map(record => {
    switch (record.association_type) {
      case 'deal':
        const deal = normalizeDeal(record.deal)

        return {
          ...record,
          deal
        }
      case 'contact':
        const contact = normalizeContact(record.contact)

        return {
          ...record,
          contact
        }
      case 'listing':
        const listing = normalizeListing(record.listing)

        return {
          ...record,
          listing
        }
      default:
        return null
    }
  })
}

/**
 * Normalizing contact entity as an association object
 * @param {object} contact The contact entity
 * @returns {object} a normalized object of associations
 */
export function normalizeContact(contact) {
  if (!contact) {
    return null
  }

  const { type, id, summary } = contact
  const {
    email,
    phone_number,
    display_name,
    profile_image_url: image
  } = summary

  return {
    id,
    type,
    title: display_name,
    avatar: {
      image,
      size: 32,
      placeHolderImage: '/static/icons/contact-association-avatar.svg',
      title:
        email !== display_name && phone_number !== display_name
          ? display_name
          : ''
    },
    url: `/dashboard/contacts/${id}`,
    details: detailText([email, phone_number])
  }
}

/**
 * Normalizing listing entity as an association object
 * @param {object} listing The listing entity
 * @param {boolean} showStatus
 * @returns {object} a normalized associations
 */
export const normalizeListing = (listing, showStatus = true) => {
  if (!listing) {
    return null
  }

  return {
    avatar: {
      image: listing.cover_image_url,
      isOnline: showStatus,
      size: 32,
      showStatus,
      statusColor: `#${getStatusColor(listing.status)}`,
      placeHolderImage: '/static/icons/listing-place-holder.svg'
    },
    details: getListingAddress(listing),
    id: listing.id,
    location: listing.location || listing.property.address.location,
    original: listing,
    title: `Listing - ${listing.status}, $${listing.price.toLocaleString()}`,
    type: 'listing',
    url: `/dashboard/mls/${listing.id}`
  }
}

/**
 * Normalizing deal entity as an association object
 * @param {object} deal The deal
 * @param {boolean} showStatus
 * @returns {object} a normalized association
 */
export const normalizeDeal = (deal, showStatus = true) => {
  if (!deal) {
    return null
  }

  return {
    avatar: {
      image: getDealfield(deal, 'photo'),
      isOnline: showStatus,
      size: 32,
      showStatus,
      statusColor: `#${getStatusColor(getDealStatus(deal))}`,
      placeHolderImage: '/static/icons/associated-deals-place-holder.svg'
    },
    details: getDealAddress(deal),
    id: deal.id,
    title: `Deal - ${deal.deal_type}, ${deal.property_type}`,
    type: deal.type,
    url: `/dashboard/deals/${deal.id}`
  }
}

function detailText(props) {
  return props.filter(i => i).join(', ')
}
