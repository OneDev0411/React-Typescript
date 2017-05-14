import React from 'react'
import { connect } from 'react-redux'
import { getContacts, getTags } from '../../../../store_actions/contact'

class Contacts extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.init()
  }

  async init() {
    const { dispatch, user } = this.props

    // get contacts
    dispatch(getContacts(user))

    // get tags
    dispatch(getTags(user))
  }

  render() {
    const { user, contacts, dispatch } = this.props

    const children = React.cloneElement(this.props.children, {
      dispatch,
      user,
      contacts: contacts.list,
      tags: contacts.tags
    })

    return (
      <div className="crm">
        <div className="contacts">
          {
            !contacts.list &&
            <div className="loading-list">
              <div><i className="fa fa-spinner fa-spin fa-2x fa-fw" /></div>
              <b>Loading contacts ...</b>
            </div>
          }

          { contacts.list && children }
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  contacts: state.contact
}))(Contacts)
