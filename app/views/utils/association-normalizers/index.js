import {
  getField as getDealfield,
  getAddress as getDealAddress
} from '../../../models/Deal/context-helper'
import { getListingAddress } from '../../../utils/listing'

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
      borderRadius: 100,
      placeHolderImage: '/static/images/contacts/ic_person_black_24dp_2x.png',
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
 * @returns {object} a normalized associations
 */
export const normalizeListing = listing => {
  if (!listing) {
    return null
  }

  const {
    id,
    type = 'listing',
    full_address,
    price,
    status,
    image,
    property
  } = listing

  let title = full_address

  if (!title && property) {
    title = getListingAddress(property.address)
  }

  return {
    id,
    type,
    title,
    avatar: {
      image,
      size: 32,
      borderRadius: 3,
      placeHolderImage: '/static/images/deals/home.png'
    },
    url: `/dashboard/mls/${id}`,
    details: detailText([status, price])
  }
}

/**
 * Normalizing deal entity as an association object
 * @param {object} deal The deal
 * @returns {object} a normalized association
 */
export const normalizeDeal = deal => {
  if (!deal) {
    return null
  }

  const { id, type, deal_type, property_type } = deal
  const image = getDealfield(deal, 'photo')
  const title = getDealAddress(deal)

  return {
    id,
    type,
    title,
    avatar: {
      image,
      size: 32,
      borderRadius: 3,
      placeHolderImage: '/static/images/deals/home.png'
    },
    url: `/dashboard/deals/${id}`,
    details: detailText([deal_type, property_type])
  }
}

function detailText(props) {
  return props.filter(i => i).join(', ')
}
