import React, { Component } from 'react'
import { connect } from 'react-redux'

import { mdiCalendar } from '@mdi/js'

import { normalizeAssociations } from 'views/utils/association-normalizers'
import { searchContacts } from 'actions/contacts'

import { EventDrawer } from 'components/EventDrawer'
import { selectContact } from 'reducers/contacts/list'
import { GridActionButton } from 'components/Grid/Table/features/Actions/Button'

class CreateEvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDrawer: false
    }
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

  onEventSubmit = async () => {
    this.closeDrawer()
    await this.props.submitCallback()
  }

  render() {
    const { user, associations, disabled } = this.props

    return (
      <>
        <GridActionButton
          label="Create Event"
          icon={mdiCalendar}
          disabled={disabled}
          onClick={this.openDrawer}
        />
        {this.state.showDrawer && (
          <EventDrawer
            isOpen
            user={user}
            defaultAssociation={associations}
            onClose={this.closeDrawer}
            submitCallback={this.onEventSubmit}
          />
        )}
      </>
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

export default connect(mapStateToProps, {
  searchContacts
})(CreateEvent)
