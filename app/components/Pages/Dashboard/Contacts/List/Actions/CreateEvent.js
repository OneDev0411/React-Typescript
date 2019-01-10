import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { normalizeAssociations } from 'views/utils/association-normalizers'

import ActionButton from 'components/Button/ActionButton'
import { EventDrawer } from 'components/EventDrawer'
import { selectContact } from 'reducers/contacts/list'
import { getContacts } from 'store_actions/contacts'

class CreateEvent extends Component {
  state = {
    showDrawer: false
  }

  openDrawer = () => {
    this.setState({
      showDrawer: true
    })
  }

  closeDrawer = () => {
    this.setState({
      showDrawer: false
    })
  }

  onEventSubmit = () => {
    this.props.resetSelectedRows()
    this.props.getContacts()
    this.closeDrawer()
  }

  render() {
    const { user, associations } = this.props

    return (
      <Fragment>
        <ActionButton
          appearance="outline"
          size="small"
          onClick={this.openDrawer}
        >
          Create Event
        </ActionButton>
        {this.state.showDrawer && (
          <EventDrawer
            isOpen
            user={user}
            defaultAssociation={associations}
            onClose={this.closeDrawer}
            submitCallback={this.onEventSubmit}
          />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps({ user, contacts }, props) {
  const rawContacts = props.selectedRows.map(id => ({
    association_type: 'contact',
    contact: selectContact(contacts.list, id)
  }))
  const associations = normalizeAssociations(rawContacts)

  return {
    user,
    associations
  }
}

export default connect(
  mapStateToProps,
  { getContacts }
)(CreateEvent)
