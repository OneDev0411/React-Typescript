import fecha from 'fecha'

import { getContact } from 'models/contacts/get-contact'
import { searchContacts } from 'models/contacts/search-contacts'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import { getContactAttributesBySection } from 'models/contacts/helpers/get-contact-attributes-by-section'
import { getAttributeFromSummary } from 'models/contacts/helpers/get-attribute-from-summary'

import { selectDefsBySection } from '../../../reducers/contacts/attributeDefs'
import { getAddresses } from '../../../components/Pages/Dashboard/Contacts/Profile/Addresses/helpers/get-addresses'
import { normalizeContact as normalizeContactForAssociation } from '../../utils/association-normalizers'

import {
  FormatterOutputType,
  ProfileType,
  SocialMediasType,
  SocialMediasEnum,
  ProfileDateType
} from './types'

// Helpers

export function getName(data: ProfileType) {
  if (data.name) {
    return data.name
  }

  if (data.email) {
    return data.email.slice(0, 1)
  }

  return '*'
}

// `address` is an array of addresses that we need to
// select the main one.
function selectAddress(address): string {
  if (address.length > 0) {
    // TODO: Ask product to tell which address should select as main address.
    return address[0].full_address
  }

  return ''
}

function socialMediasInContact(contact: IContact): SocialMediasType[] {
  const types = Object.keys(SocialMediasEnum)

  if (!contact.attributes) {
    return []
  }

  return contact.attributes
    .filter(attr => types.includes(attr.attribute_type))
    .map(social => ({ type: social.attribute_type, url: social.text }))
}

function extractRequiredDataFromContact(
  contactResponse,
  attributeDefs
): ProfileType {
  const contact = normalizeContact(contactResponse)
  const dates = getContactAttributesBySection(contact, 'Dates')
  const addresses = getContactAttributesBySection(contact, 'Addresses')

  const addressAttributeDefs = selectDefsBySection(attributeDefs, 'Addresses')
  const address = getAddresses(addresses, addressAttributeDefs)

  return {
    name: getAttributeFromSummary(contact, 'display_name'),
    email: getAttributeFromSummary(contact, 'email'),
    phone: getAttributeFromSummary(contact, 'phone_number'),
    profile_image_url: getAttributeFromSummary(contact, 'profile_image_url'),
    last_touch: contact.last_touch || undefined,
    address: selectAddress(address),
    socials: socialMediasInContact(contact),
    dates: dates.map(item => ({
      title: item.attribute_def.label,
      date: item.date,
      is_partner: item.is_partner
    }))
  }
}

// Getting contact from server and fill the predefined object
export async function getContactData(
  contact_id,
  attributeDefs
): Promise<FormatterOutputType> {
  try {
    const response = await getContact(contact_id)

    const contact_association = normalizeContactForAssociation(response.data)
    const association = {
      association_type: 'contact',
      contact: contact_association,
      id: contact_association.id,
      disableDefaultAssociationChecking: true
    }

    const outputData: ProfileType = extractRequiredDataFromContact(
      response.data,
      attributeDefs
    )

    return {
      contact_status: 'finished',
      contact_id,
      data: outputData,
      meta: {
        association
      }
    }
  } catch (e) {
    console.log(e)

    // TODO: it should return the last information
    return {
      contact_status: 'failed',
      contact_id,
      data: {},
      meta: {}
    }
  }
}

export async function findContact(email: string, base_output, attributeDefs) {
  try {
    const res = await searchContacts(email)

    if (res.data.length > 0) {
      const foundContact = res.data[0]

      return {
        ...base_output,
        contact_id: foundContact.id,
        contact_status: 'finished',
        data: extractRequiredDataFromContact(foundContact, attributeDefs)
      }
    }

    return {
      ...base_output,
      contact_status: 'finished'
    }
  } catch (e) {
    console.log(e)

    return {
      ...base_output,
      contact_status: 'finished'
    }
  }
}

export function isNearDate(date: number) {
  return new Date(date * 1000).getMonth() === new Date().getMonth()
}

export function activitiesFormatter(activities?: ProfileDateType[]) {
  if (!activities) {
    return []
  }

  const output = activities.sort(function activitySort(a, b) {
    if (a.title.includes('Birthday')) {
      return -1
    }

    if (b.title.includes('Birthday')) {
      return 1
    }

    return 0
  })

  // TODO: the map part can be a separate function
  return output
    .slice(0, 5)
    .map(item =>
      item.is_partner && item.title.includes('Birthday')
        ? { ...item, title: `Partner ${item.title}` }
        : item
    )
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()

  const utcDate = new Date(year, month, day)

  if (utcDate.getFullYear() === 1800) {
    return fecha.format(utcDate, 'MMM DD')
  }

  return fecha.format(utcDate, 'MMM DD, YYYY')
}
