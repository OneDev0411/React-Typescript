import _ from 'underscore'

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
 * Converts a contact object to a role contact
 * @param {Object} contact - The contact object
 */
export function convertContactToRole(contact) {
  let role = {}

  const {
    title,
    last_name,
    middle_name,
    first_name,
    email,
    companies,
    phone_number,
    company_title
  } = contact

  if (first_name === email || first_name === phone_number) {
    role.first_name = ''
  }

  if (!company_title && companies && companies[0]) {
    role.company_title = contact.companies[0].company
  }

  role = {
    ...contact,
    ...role,
    legal_prefix: title,
    legal_first_name: first_name,
    legal_middle_name: middle_name,
    legal_last_name: last_name,
    role: null
  }

  delete role.id

  return role
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
 * returns updated Name attribute
 * @param {Object} form - role form
 */
export function getUpdatedNameAttribute(form) {
  if (!form.contact) {
    return null
  }

  const { names } = form.contact.sub_contacts[0].attributes
  const nameFields = {
    title: form.legal_prefix,
    first_name: form.legal_first_name,
    middle_name: form.legal_middle_name,
    last_name: form.legal_last_name
  }

  let name = {
    id: undefined,
    type: 'name'
  }

  if (Array.isArray(names) && names.length > 0) {
    name = {
      ...name,
      ...names[0]
    }
  }

  const updatedFields = {}

  _.each(nameFields, (value, attr) => {
    const isValidField = _.keys(nameFields).includes(attr)

    if (isValidField && (!name[attr] || name[attr] !== value)) {
      updatedFields[attr] = value
    }
  })

  if (_.size(updatedFields) === 0) {
    return null
  }

  return {
    ...name,
    ...updatedFields
  }
}

/**
 * returns changed attributes
 * @param {Object} form - role form data
 */
export function getNewAttributes(form = {}) {
  const attributes = []
  const types = [
    { singularName: 'email', pluralName: 'emails' },
    { singularName: 'phone_number', pluralName: 'phones' },
    { singularName: 'company_title', pluralName: 'companies', alias: 'company' }
  ]

  types.forEach(({ singularName, pluralName, alias }) => {
    const contactName = alias || singularName

    const isNew =
      form[singularName] &&
      form[pluralName] &&
      form[pluralName]
        .map(item => item[contactName])
        .includes(form[singularName]) === false

    if (isNew) {
      attributes.push({
        type: contactName,
        [contactName]: form[singularName],
        is_primary: form[pluralName].length === 0
      })
    }
  })

  return attributes
}

/**
 * returns combined objects of getNewAttributes and  getUpdatedNameAttribute
 * @param {Object} form - role form
 */
export function getUpsertedAttributes(form) {
  const attributes = getNewAttributes(form)
  const nameAttribute = getUpdatedNameAttribute(form)

  if (nameAttribute) {
    attributes.push(nameAttribute)
  }

  return attributes
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
