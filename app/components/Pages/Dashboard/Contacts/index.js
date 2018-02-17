import React from 'react'
import { connect } from 'react-redux'
import { getTags } from '../../../../store_actions/contact'
import getContacts from '../../../../store_actions/contacts/get-contacts'
import { selectContacts } from '../../../../reducers/contacts/list'

class Contacts extends React.Component {
  componentDidMount() {
    const { getContacts, getTags, contactsList, tags } = this.props

    if (!contactsList) {
      getContacts()
    }

    if (!tags) {
      getTags()
    }
  }

  render() {
    const { contactsList } = this.props

    return (
      <div className="contacts">
        {contactsList ? (
          this.props.children
        ) : (
          <div className="loading-list">
            <div>
              <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
            </div>
            <b>Loading contacts ...</b>
          </div>
        )}
      </div>
    )
  }
}

function mapStateToProps({ contacts: { list, tags } }) {
  const contactsList = selectContacts(list)

  return {
    tags,
    contactsList
  }
}

export default connect(mapStateToProps, { getContacts, getTags })(Contacts)
