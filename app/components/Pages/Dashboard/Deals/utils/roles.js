import _ from 'underscore'
import {
  selectDefinitionByName,
  attributeDefs
} from '../../../../../reducers/contacts/attributeDefs'
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
  let name = []
  const {
    legal_full_name,
    legal_prefix,
    legal_first_name,
    legal_last_name,
    company_title
  } = userRole

  if (legal_full_name) {
    name = [legal_prefix, legal_full_name]
  } else if (legal_first_name || legal_last_name) {
    name = [legal_prefix, legal_first_name, legal_last_name]
  } else {
    name = [company_title]
  }

  return name.join(' ')
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
    const attribute = getObjectOfContractAttribute(contact, name)

    if (!attribute) {
      return false
    }

    normalizedContact[name] = attribute.length === 1 ? attribute[0] : attribute
  })

  return normalizedContact
}

/**
 * returns value of give attribute
 * @param {Object} contact - the contact object
 * @param {String} attributeName - name of attribute
 */
function getValueOfContactAttribute(contact, attributeDefs, attributeName) {
  const attributeObject = getObjectOfContractAttribute(
    contact,
    attributeDefs,
    attributeName
  )

  if (!attributeObject) {
    return ''
  }

  const definition = attributeObject.attribute_def

  return contact[attributeName][definition.data_type]
}

/**
 *
 * @param {Object} contact - contact object
 * @param {Object} attributeDefs - list of definitions
 * @param {String} attributeName - attribute name
 */
function getObjectOfContractAttribute(contact, attributeDefs, attributeName) {
  console.log('>>>>', attributeDefs, attributeName)

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
  const normalizedContact = getNormalizedContact(contact, attributeDefs)
  const form = {
    contact
  }

  const roleFields = {
    legal_prefix: 'title',
    legal_first_name: 'first_name',
    legal_middle_name: 'middle_name',
    legal_last_name: 'last_name'
  }

  _.each(roleFields, (contactAttribute, roleAttribute) => {
    form[roleAttribute] = getValueOfContactAttribute(
      contact,
      attributeDefs,
      contactAttribute
    )
  })

  form.email = normalizedContact.summary.email
  form.phone_number = normalizedContact.summary.phone_number
  form.company = normalizedContact.summary.company
  form.emails = normalizedContact.emails
  form.phones = normalizedContact.phones
  form.companies = normalizedContact.companies

  console.log(form)

  return form
}

/**
 * Converts a role object to a contact model
 * @param {Object} formData - Role's object
 */
export function convertRoleToContact(form = {}) {
  const {
    email,
    phone_number,
    company_title,
    legal_prefix,
    legal_first_name,
    legal_middle_name,
    legal_last_name
  } = form

  return {
    emails: email ? [email] : [],
    phone_numbers: phone_number ? [phone_number] : [],
    companies: company_title ? [company_title] : [],
    title: legal_prefix,
    first_name: legal_first_name,
    middle_name: legal_middle_name,
    last_name: legal_last_name
  }
}

/**
 * returns changed attributes
 * @param {Object} form - role form data
 */
export function getContactDiff(form = {}, attributeDefs) {
  const diff = {}

  const contactFields = {
    title: 'legal_prefix',
    first_name: 'legal_first_name',
    middle_name: 'legal_middle_name',
    last_name: 'legal_last_name',
    email: 'email',
    phone_number: 'phone_number',
    company_title: 'company'
  }

  _.each(contactFields, (roleAttribute, contactAttribute) => {
    const attribute = getObjectOfContractAttribute(
      contact,
      attributeDefs,
      contactAttribute
    )

    if (!attribute) {
      return false
    }

    console.log('>>>>', contactAttribute, form[roleAttribute], attribute)
  })

  // const attributes = []
  // const types = [
  //   { singularName: 'email', pluralName: 'emails' },
  //   { singularName: 'phone_number', pluralName: 'phones' },
  //   { singularName: 'company', pluralName: 'companies' }
  // ]
  // types.forEach(({ singularName, pluralName }) => {
  //   const isNew =
  //     form[singularName] &&
  //     form[pluralName] &&
  //     form[pluralName]
  //       .map(item => item[singularName])
  //       .includes(form[singularName]) === false
  //   if (isNew) {
  //     const definition = selectDefinitionByName(attributeDefs, singularName)
  //     attributes.push({
  //       definitionId: definition.id,
  //       [definition.data_type]: form[singularName],
  //       is_primary: form[pluralName].length === 0
  //     })
  //   }
  // })
  // return attributes
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
