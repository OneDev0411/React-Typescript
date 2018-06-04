import React from 'react'
import { connect } from 'react-redux'

import {
  getContacts,
  getContactsTags,
  getContactsSavedSegments
} from '../../../../store_actions/contacts'

import { selectTags } from '../../../../reducers/contacts/tags'
import { selectContacts } from '../../../../reducers/contacts/list'
import ContactsList from './List'

class Contacts extends React.Component {
  componentDidMount() {
    this.initializeContacts()
  }

  async initializeContacts() {
    const {
      getContacts,
      getContactsTags,
      getContactsSavedSegments,
      contactsList,
      tagsList,
      filterSegments
    } = this.props

    if (contactsList.length <= 1) {
      await getContacts()
    }

    if (tagsList.length === 0) {
      getContactsTags()
    }

    if (filterSegments.isFetched === false) {
      getContactsSavedSegments()
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

function mapStateToProps({ contacts: { list, tags, filterSegments } }) {
  const contactsList = selectContacts(list)
  const tagsList = selectTags(tags)

  return {
    tagsList,
    contactsList,
    filterSegments
  }
}

export default connect(mapStateToProps, {
  getContacts,
  getContactsTags,
  getContactsSavedSegments
})(Contacts)
