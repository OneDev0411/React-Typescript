import React from 'react'
import { connect } from 'react-redux'

import { getContactsTags } from '../../../../store_actions/contacts'

import { selectTags } from '../../../../reducers/contacts/tags'
import ContactsList from './List'

class Contacts extends React.Component {
  componentDidMount() {
    this.initializeContacts()
  }

  async initializeContacts() {
    const { getContactsTags, tagsList } = this.props

    if (tagsList.length === 0) {
      getContactsTags()
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

function mapStateToProps({ contacts: { tags } }) {
  const tagsList = selectTags(tags)

  return {
    tagsList
  }
}

export default connect(mapStateToProps, {
  getContactsTags
})(Contacts)
