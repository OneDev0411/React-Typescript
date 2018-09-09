import _ from 'underscore'
import { selectDefinitionByName } from '../../../../../reducers/contacts/attributeDefs'
import { getContactAttribute } from '../../../../../models/contacts/helpers/get-contact-attribute'

export const ROLE_NAMES = [
  'BuyerAgent',
  'BuyerReferral',
  'CoBuyerAgent',
  'SellerAgent',
  'SellerReferral',
  'CoSellerAgent',
  'Buyer',
  'BuyerPowerOfAttorney',
  'Seller',
  'SellerPowerOfAttorney',
  'Title',
  'BuyerLawyer',
  'SellerLawyer',
  'Lender',
  'TeamLead',
  'Appraiser',
  'Inspector',
  'Tenant',
  'LandlordPowerOfAttorney',
  'Landlord',
  'TenantPowerOfAttorney'
]

export const AGENT_ROLES = [
  'BuyerAgent',
  'CoBuyerAgent',
  'SellerAgent',
  'CoSellerAgent'
]

const aliases = {
  Title: 'Escrow Officer',
  Lender: 'Lending Agent',
  BuyerPowerOfAttorney: 'Power of Attorney - Buyer',
  SellerPowerOfAttorney: 'Power of Attorney - Seller',
  LandlordPowerOfAttorney: 'Power of Attorney - Landlord',
  TenantPowerOfAttorney: 'Power of Attorney - Tenant'
}

/**
 * returns a human readable role name
 * @param {string} role - server role name
 */
export function roleName(role) {
  const name = aliases[role] || role

  return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/Co\s/g, 'Co-')
}

/**
 * returns user legal name based on given fields
 * @param {Object} userRole - the roles including name parts
 */
export function getLegalFullName(userRole) {
  return userRole.legal_full_name
}

/**
 *
 * @param {Object} contact - the contact
 * @param {Object} attributeDefs - list of definitions
 */
export function getNormalizedContact(contact, attributeDefs) {
  const normalizedContact = {
    summary: contact.summary
  }

  const pluralFields = [
    { singular: 'email', plural: 'emails' },
    { singular: 'phone_number', plural: 'phones' },
    { singular: 'company', plural: 'companies' },
    { singular: 'profile_image_url', plural: 'profile_image_url' }
  ]

  pluralFields.forEach(({ singular, plural }) => {
    normalizedContact[plural] = getContactAttribute(
      contact,
      selectDefinitionByName(attributeDefs, singular)
    )
  })

  _.each(contact.summary, (value, name) => {
    const attributes = getContactAttributeObject(contact, attributeDefs, name)

    if (!attributes) {
      return false
    }

    normalizedContact[name] =
      attributes.length === 1 ? attributes[0] : attributes
  })

  return normalizedContact
}

/**
 * returns value of give attribute
 * @param {Object} contact - the contact object
 * @param {String} attributeName - name of attribute
 */
function getContactAttributeValue(contact, attributeDefs, attributeName) {
  const attributes = getContactAttributeObject(
    contact,
    attributeDefs,
    attributeName
  )

  if (!attributes || attributes.length === 0) {
    return ''
  }

  const dataType = attributes[0].attribute_def.data_type

  return attributes[0][dataType]
}

/**
 *
 * @param {Object} contact - contact object
 * @param {Object} attributeDefs - list of definitions
 * @param {String} attributeName - attribute name
 */
function getContactAttributeObject(contact, attributeDefs, attributeName) {
  const definition = selectDefinitionByName(attributeDefs, attributeName)

  if (!definition) {
    return null
  }

  return getContactAttribute(contact, definition)
}

/**
 * Converts a contact object to a role contact
 * @param {Object} contact - The contact object
 * @param {Object} attributeDefs - list of definitions
 */
export function convertContactToRole(contact, attributeDefs) {
  const { summary, emails, phones, companies } = getNormalizedContact(
    contact,
    attributeDefs
  )

  const form = {
    contact
  }

  const roleFields = {
    legal_prefix: 'title',
    legal_first_name: 'first_name',
    legal_middle_name: 'middle_name',
    legal_last_name: 'last_name',
    company_title: 'company'
  }

  _.each(roleFields, (contactAttribute, roleAttribute) => {
    form[roleAttribute] = getContactAttributeValue(
      contact,
      attributeDefs,
      contactAttribute
    )
  })

  return {
    ...form,
    emails,
    phones,
    companies,
    email: summary.email,
    phone_number: summary.phone_number,
    company: summary.company
  }
}

/**
 * returns list of contact fields (mapped to equivalent role fields)
 */
function getContactFields() {
  return {
    title: 'legal_prefix',
    first_name: 'legal_first_name',
    middle_name: 'legal_middle_name',
    last_name: 'legal_last_name',
    email: 'email',
    phone_number: 'phone_number',
    company: 'company_title',
    source_type: 'source_type'
  }
}

/**
 * Converts a role object to a contact model
 * @param {Object} formData - Role's object
 */
export function convertRoleToContact(form = {}, attributeDefs) {
  const contact = {
    attributes: []
  }

  _.each(getContactFields(), (roleAttribute, contactAttribute) => {
    if (!form[roleAttribute]) {
      return
    }

    const definition = selectDefinitionByName(attributeDefs, contactAttribute)

    contact.attributes.push({
      attribute_def: definition.id,
      [definition.data_type]: form[roleAttribute]
    })
  })

  return contact
}

/**
 * returns changed attributes
 * @param {Object} form - role form data
 */
export function getContactDiff(form = {}, attributeDefs) {
  const diff = []

  _.each(getContactFields(), (roleAttribute, contactAttribute) => {
    const attributes = getContactAttributeObject(
      form.contact,
      attributeDefs,
      contactAttribute
    )
    const definition = selectDefinitionByName(attributeDefs, contactAttribute)
    const roleFieldValue = form[roleAttribute]

    if (!attributes || !roleFieldValue) {
      return false
    }

    const valueIndex = _.findIndex(
      attributes,
      attr => attr[definition.data_type] === roleFieldValue
    )

    if (valueIndex > -1) {
      return
    }

    if (definition.singular && attributes.length === 1) {
      diff.push({
        id: attributes[0].id,
        attribute_def: definition.id,
        [definition.data_type]: roleFieldValue
      })
    } else {
      diff.push({
        attribute_def: definition.id,
        [definition.data_type]: roleFieldValue
      })
    }
  })

  return diff
}

/**
 *
 * @param {Object} deal - deal object
 * @param {Object} roles - objects of roles
 */
export function getPrimaryAgent(deal, roles) {
  const roleType = deal.deal_type === 'Buying' ? 'BuyerAgent' : 'SellerAgent'

  if (deal.roles) {
    const primaryRole = _.find(
      deal.roles,
      roleId => roles[roleId].role === roleType
    )

    if (primaryRole) {
      return `${roles[primaryRole].legal_first_name} ${
        roles[primaryRole].legal_last_name
      }`
    }
  }

  return ''
}
