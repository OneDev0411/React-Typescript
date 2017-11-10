import React from 'react'
import { connect } from 'react-redux'
import { getContacts, getTags } from '../../../../store_actions/contact'

class Contacts extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { getContacts, getTags, contacts, tags } = this.props

    // get contacts
    if (!contacts) {
      getContacts()
    }

    // get tags
    if (!tags) {
      getTags()
    }
  }

  render() {
    const { contacts } = this.props
    return (
      <div className="contacts">
        {
          contacts ?
            this.props.children :
            <div className="loading-list">
              <div><i className="fa fa-spinner fa-spin fa-2x fa-fw" /></div>
              <b>Loading contacts ...</b>
            </div>
        }
      </div>
    )
  }
}

export default connect(({ contacts }) => ({
  contacts: contacts.list,
  tags: contacts.tags
}), { getContacts, getTags })(Contacts)
