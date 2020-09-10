import {
  getField as getDealField,
  getStatus as getDealStatus
} from 'models/Deal/helpers/context'
import {
  getListingAddress,
  getStatusColor,
  isLeaseProperty
} from 'utils/listing'
import { getAccountAvatar } from 'components/Avatar/helpers/get-avatar'

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
      case 'email':
        const email = normalizeEmail(record.email)

        return {
          ...record,
          email
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

  const { type, id, email, phone_number, display_name } = contact

  return {
    id,
    type,
    title: display_name,
    avatar: {
      url: getAccountAvatar(contact),
      placeHolderImage: '/static/icons/contact-association-avatar.svg',
      alt:
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
      url: listing.cover_image_url,
      isOnline: showStatus,
      showStatus,
      statusColor: `#${getStatusColor(listing.status)}`,
      placeHolderImage: '/static/icons/listing-place-holder.svg'
    },
    details: `${listing.status}, 
    $${listing.price.toLocaleString()}${isLeaseProperty(listing) ? '/mo' : ''}`,
    id: listing.id,
    location: listing.location || listing.property.address.location,
    original: listing,
    title: getListingAddress(listing),
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
      url: getDealField(deal, 'photo'),
      isOnline: showStatus,
      showStatus,
      statusColor: `#${getStatusColor(getDealStatus(deal))}`,
      placeHolderImage: '/static/icons/associated-deals-place-holder.svg'
    },
    details: `${deal.deal_type}, ${deal.property_type}`,
    id: deal.id,
    title: getDealField(deal, 'street_address'),
    type: deal.type,
    url: `/dashboard/deals/${deal.id}`
  }
}

/**
 * Normalizing email entity as an association object
 * @param {object} email The Email
 * @param {boolean} showStatus
 * @returns {object} a normalized association
 */
export const normalizeEmail = email => {
  if (!email) {
    return null
  }

  let img = ''
  let body = email.text
  const { template } = email

  if (template) {
    body = template.template && template.template.template_type
    img = template.file && template.file.preview_url
  }

  return {
    body,
    id: email.id,
    img,
    subject: email.subject,
    email
  }
}

function detailText(props) {
  return props.filter(i => i).join(', ')
}
