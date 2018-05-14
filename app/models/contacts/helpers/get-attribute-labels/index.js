import {
  selectDefsBySection,
  selectDefinitionByName
} from '../../../../reducers/contacts/attributeDefs'

/**
 * returns object list of labels
 * @param {String} suffix - the suffix string of showing label
 * @param {Object} attributeDef - given attribute definition
 * @param {String} defaultLabel - the default label
 */
export function getAttributeLabels(
  attributeDef,
  suffix = '',
  defaultLabel = 'Other'
) {
  if (!attributeDef || !attributeDef.has_label) {
    return {}
  }

  const labels = {}

  attributeDef.labels.forEach(label => {
    labels[getLabelKey(label, defaultLabel)] = {
      name: label,
      title: `${label} ${suffix}`.trim()
    }
  })

  return labels
}

/**
 * returns a key for the given label
 * @param {String} label - label name
 * @param {String} defaultLabel - the default label
 */
function getLabelKey(label, defaultLabel) {
  return label === defaultLabel ? 'default' : label.toLowerCase()
}

/**
 * returns address labels
 * @param {Object} attributeDefs - list of all definitions
 */
export function getAddressLabels(attributeDefs) {
  const addressDefinitions = selectDefsBySection(attributeDefs, 'Addresses')

  return getAttributeLabels(
    selectDefinitionByName(attributeDefs, addressDefinitions[0].name),
    'Address'
  )
}

/**
 * returns phone labels
 * @param {Object} attributeDefs - list of all definitions
 */
export function getPhoneNumberLabels(attributeDef) {
  return getAttributeLabels(attributeDef, 'Phone')
}

/**
 * returns email labels
 * @param {Object} attributeDefs - list of all definitions
 */
export function getEmailLabels(attributeDef) {
  return getPhoneNumberLabels(attributeDef, 'Email')
}

/**
 * returns website labels
 * @param {Object} attributeDefs - list of all definitions
 */
export function getWebsiteLabels(attributeDef) {
  const labelsWithIcon = {}
  const labels = getAttributeLabels(attributeDef, '', 'Website')

  const icons = {
    default: {
      name: 'briefcase',
      color: '#15bd6b'
    },
    instagram: {
      name: 'instagram',
      color: '#EC3661'
    },
    facebook: {
      color: '#4367B2',
      name: 'facebook-square'
    },
    twitter: {
      name: 'twitter-square',
      color: '#1da1f2'
    },
    blog: {
      name: 'wordpress',
      color: '#446'
    }
  }

  Object.keys(labels).forEach(key => {
    labelsWithIcon[key] = {
      title: labels[key].title,
      icon: icons[key] || icons.default
    }
  })

  return labelsWithIcon
}
