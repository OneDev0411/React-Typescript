import { getContact } from 'models/contacts/get-contact'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import { getContactAttributesBySection } from 'models/contacts/helpers/get-contact-attributes-by-section'
import { getAttributeFromSummary } from 'models/contacts/helpers/get-attribute-from-summary'

import store from '../../../stores'
import { selectDefsBySection } from '../../../reducers/contacts/attributeDefs'
import { getAddresses } from '../../../components/Pages/Dashboard/Contacts/Profile/Addresses/helpers/get-addresses'
import { normalizeContact as normalizeContactForAssociation } from '../../utils/association-normalizers'

import { FormatterOutputType, ProfileType } from './useProfile'

// Formatters

function insightFormatter(data): FormatterOutputType {
  return {
    contact_status: 'not_started',
    contact_id: data.contact,
    data: {
      name: data.display_name,
      email: data.email_address,
      profile_image_url: data.profile_image_url
    },
    meta: {}
  }
}

function contactFormatter(data): FormatterOutputType {
  // data.suumary is for regular contact
  // data.title & data.details is for association contacts (app/views/components/AssocationItem/index.js)
  return {
    contact_status: 'not_started',
    contact_id: data.id,
    data: {
      name: (data.summary && data.summary.display_name) || data.title,
      email: (data.summary && data.summary.email) || data.details,
      profile_image_url:
        (data.summary && data.summary.profile_image_url) ||
        (data.avatar && data.avatar.image)
    },
    meta: {}
  }
}

// Helpers

export function get_name(data) {
  if (data.name) {
    return data.name
  }

  if (data.email) {
    return data.email.slice(0, 1)
  }

  return '*'
}
export function formatter(type, initData): FormatterOutputType {
  let formattedData: FormatterOutputType = {
    contact_status: 'not_started',
    contact_id: '',
    data: {},
    meta: {}
  }

  // Extracting data from context (where the MiniContact is using)
  // based on type using formatters
  if (type == 'insight') {
    formattedData = insightFormatter(initData)
  }

  if (type == 'contact') {
    formattedData = contactFormatter(initData)
  }

  return formattedData
}

// `address` is an array of addresses that we need to
// select the main one.
function select_address(address): string {
  if (address.length > 0) {
    // TODO: Ask product to tell which address should select as main address.
    return address[0].full_address
  }

  return ''
}

// Getting contact from server and fill the predefined object
export async function get_contact_data(
  contact_id
): Promise<FormatterOutputType> {
  try {
    const response = await getContact(contact_id)
    const reduxState = store.getState()

    const contact = normalizeContact(response.data)
    const dates = getContactAttributesBySection(contact, 'Dates')
    const addresses = getContactAttributesBySection(contact, 'Addresses')
    const contact_association = normalizeContactForAssociation(response.data)
    const association = {
      association_type: 'contact',
      contact: contact_association,
      id: contact_association.id,
      disableDefaultAssociationChecking: true
    }

    const addressAttributeDefs = selectDefsBySection(
      reduxState.contacts.attributeDefs,
      'Addresses'
    )
    const address = getAddresses(addresses, addressAttributeDefs)

    const output_data: ProfileType = {
      name: getAttributeFromSummary(contact, 'display_name'),
      email: getAttributeFromSummary(contact, 'email'),
      phone: getAttributeFromSummary(contact, 'phone_number'),
      profile_image_url: getAttributeFromSummary(contact, 'profile_image_url'),
      last_touch: contact.last_touch,
      address: select_address(address),
      dates: dates.map(item => ({
        title: item.attribute_def.label,
        date: item.date
      }))
    }

    return {
      contact_status: 'finished',
      contact_id,
      data: output_data,
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
