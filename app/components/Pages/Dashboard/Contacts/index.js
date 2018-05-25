import React from 'react'
import { connect } from 'react-redux'

import {
  getContacts,
  getContactsTags
} from '../../../../store_actions/contacts'
import { selectTags } from '../../../../reducers/contacts/tags'
import { selectContacts } from '../../../../reducers/contacts/list'
import ContactsList from './List'

class Contacts extends React.Component {
  componentDidMount() {
    this.initializeContacts()
  }

  async initializeContacts() {
    const { getContacts, getContactsTags, contactsList, tagsList } = this.props

    if (contactsList.length === 0) {
      await getContacts()
    }

    if (tagsList.length === 0) {
      await getContactsTags()
    }
  }

  render() {
    return (
      <div className="contacts">
        <ContactsList />
      </div>
    )
  }
}

function mapStateToProps({ contacts: { list, tags } }) {
  const contactsList = selectContacts(list)
  const tagsList = selectTags(tags)

  return {
    tagsList,
    contactsList
  }
}

export default connect(mapStateToProps, { getContacts, getContactsTags })(
  Contacts
)
