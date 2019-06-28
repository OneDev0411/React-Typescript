import _ from 'underscore'

import {
  selectDefinitionByName,
  selectDefinition
} from 'reducers/contacts/attributeDefs'

import {
  TYPE_COMPANY,
  TYPE_PERSON
} from 'components/DealRole/constants/role-types'

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
 * @param {Object} role - the roles including name parts
 */
export function getLegalFullName(role) {
  if (!role) {
    return ''
  }

  let name = role.legal_full_name
    ? [role.legal_full_name]
    : [
        role.legal_prefix,
        role.legal_first_name,
        role.legal_middle_name,
        role.legal_last_name
      ]

  if (role.role_type === TYPE_COMPANY) {
    name = [role.company_title]
  }

  return name.join(' ').trim()
}

/**
 *
 * @param {Object} contact - contact object
 * @param {Object} attributeDefs - list of definitions
 * @param {String} name - attribute name
 */
function getContactAttributeObject(contact, name) {
  return contact.attributes.filter(
    attr => attr.attribute_type === name && attr.is_partner !== true
  )
}

/**
 * Converts a contact object to a role contact
 * @param {Object} contact - The contact object
 * @param {Object} attributeDefs - list of definitions
 */
export function convertContactToRole(contact) {
  const { summary } = contact

  const values = type =>
    getContactAttributeObject(contact, type).map(
      item => item[item.attribute_def.data_type]
    )

  return {
    emails: values('email'),
    phone_numbers: values('phone_number'),
    companies: values('company'),
    legal_prefix: summary.title,
    legal_first_name: summary.first_name,
    legal_middle_name: summary.middle_name,
    legal_last_name: summary.last_name,
    email: summary.email,
    phone_number: summary.phone_number,
    company: summary.company,
    company_title: summary.company
  }
}

/**
 * returns list of contact fields (mapped to equivalent role fields)
 */
function getContactFields() {
  const addressFields = [
    'street_number',
    'street_prefix',
    'street_name',
    'street_suffix',
    'unit_number',
    'city',
    'county',
    'state',
    'postal_code'
  ]

  return [
    {
      contact: 'title',
      role: 'legal_prefix'
    },
    {
      contact: 'first_name',
      role: 'legal_first_name'
    },
    {
      contact: 'middle_name',
      role: 'legal_middle_name'
    },
    {
      contact: 'last_name',
      role: 'legal_last_name'
    },
    {
      contact: 'email',
      role: 'email'
    },
    {
      contact: 'phone_number',
      role: 'phone_number'
    },
    {
      contact: 'company',
      role: 'company_title'
    },
    {
      contact: 'source_type',
      role: 'source_type'
    },
    {
      contact: addressFields,
      role: 'parsed_current_address',
      label: 'Past',
      index: 0
    },
    {
      contact: addressFields,
      role: 'parsed_future_address',
      label: 'Home',
      index: 1
    }
  ]
}

function getContactDefinitions(attributeDefs, form, item) {
  const list = Array.isArray(item.contact) ? item.contact : [item.contact]

  return list.map(name => {
    const definition = selectDefinitionByName(attributeDefs, name)

    const formValue = form[item.role]
    const value =
      typeof formValue === 'object' && formValue !== null
        ? formValue[name]
        : formValue

    return {
      index: item.index,
      label: item.label,
      attribute_def: definition.id,
      [definition.data_type]: value || ''
    }
  })
}

/**
 * Converts a role object to a contact model
 * @param {Object} formData - Role's object
 */
export function convertRoleToContact(form = {}, user, attributeDefs) {
  const contact = {
    attributes: [],
    user
  }

  getContactFields().forEach(item => {
    if (!form[item.role]) {
      return
    }

    contact.attributes = [
      ...contact.attributes,
      ...getContactDefinitions(attributeDefs, form, item)
    ]
  })

  // add role name as tag
  contact.attributes.push(createContactTag(attributeDefs, form.role))

  return contact
}

/**
 * returns changed attributes
 * @param {Object} form - role form data
 */
export function getContactChangedAttributes(form = {}, attributeDefs) {
  const attributes = []

  getContactFields()
    // currently ignore address field when updading an existance contact record
    .filter(
      item =>
        ['parsed_current_address', 'parsed_future_address'].includes(
          item.role
        ) === false
    )
    .forEach(item => {
      const definitions = getContactDefinitions(attributeDefs, form, item)

      definitions.forEach(definition => {
        const attribute = form.contact.attributes.find(attr => {
          const condition = attr.attribute_def.id === definition.attribute_def

          return definition.index == null
            ? condition
            : condition &&
                attr.index === definition.index &&
                attr.label === definition.label
        })

        const { data_type } = selectDefinition(
          attributeDefs,
          definition.attribute_def
        )

        const value = definition[data_type]

        if (!attribute && !value) {
          return
        }

        const item = definition

        if (attribute) {
          item.id = attribute.id
        }

        attributes.push(item)
      })
    })

  const isTagExists = form.contact.attributes.some(attr => {
    const { data_type } = attr.attribute_def

    return (
      attr.attribute_type === 'tag' &&
      attr[data_type].toLowerCase() === form.role.toLowerCase()
    )
  })

  if (!isTagExists) {
    attributes.push(createContactTag(attributeDefs, form.role))
  }

  return attributes
}

function createContactTag(attributeDefs, text) {
  const tagDef = selectDefinitionByName(attributeDefs, 'tag')

  // add role name to contact as a new tag
  return {
    attribute_def: tagDef.id,
    [tagDef.data_type]: text
  }
}

/**
 *
 * @param {Object} deal - deal object
 * @param {Object} roles - objects of roles
 */
export function getPrimaryAgent(deal, roles) {
  const roleType = deal.deal_type === 'Buying' ? 'BuyerAgent' : 'SellerAgent'
  let agentId

  if (deal.roles) {
    agentId = _.find(deal.roles, roleId => roles[roleId].role === roleType)
  }

  return agentId ? roles[agentId] : null
}
/**
 *
 * @param {Object} deal - deal object
 * @param {Object} roles - objects of roles
 */
export function getPrimaryAgentName(deal, roles) {
  const agent = getPrimaryAgent(deal, roles)

  if (!agent) {
    return ''
  }

  let name = []

  if (agent.role_type === TYPE_PERSON) {
    name = [agent.legal_first_name, agent.legal_last_name]
  } else {
    name = [agent.company_title]
  }

  return name.join(' ').trim()
}

export function isPrimaryAgent(roleName, dealType) {
  return (
    (roleName === 'BuyerAgent' && dealType === 'Buying') ||
    (roleName === 'SellerAgent' && dealType === 'Selling')
  )
}
