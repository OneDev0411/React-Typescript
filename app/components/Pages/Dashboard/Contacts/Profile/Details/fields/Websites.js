import React from 'react'
import { connect } from 'react-redux'

import MultiFields from '../components/MultiFields'

import { getWebsiteLabels } from '../../../../../../../models/contacts/helpers/get-attribute-labels'
import { selectDefinitionByName } from '../../../../../../../reducers/contacts/attributeDefs'

// const DEFAULT_LABELS = {
//   default: {
//     title: 'Website',
//     icon: {
//       name: 'briefcase',
//       color: '#15bd6b'
//     }
//   },
//   instagram: {
//     title: 'Instagram',
//     icon: {
//       name: 'instagram',
//       color: '#EC3661'
//     }
//   },
//   facebook: {
//     title: 'Facebook',
//     icon: {
//       color: '#4367B2',
//       name: 'facebook-square'
//     }
//   },
//   twitter: {
//     title: 'Twitter',
//     icon: {
//       name: 'twitter-square',
//       color: '#1da1f2'
//     }
//   },
//   blog: {
//     title: 'Blog',
//     icon: {
//       name: 'wordpress',
//       color: '#446'
//     }
//   }
// }

function Websites({ contact, attributeDef }) {
  getWebsiteLabels(attributeDef)

  return (
    <MultiFields
      attributeName="website"
      contact={contact}
      defaultLabels={getWebsiteLabels(attributeDef)}
      placeholder="rechat.com"
    />
  )
}

function mapStateToProps({ contacts }) {
  return {
    attributeDef: selectDefinitionByName(contacts.attributeDefs, 'website')
  }
}

export default connect(mapStateToProps)(Websites)
