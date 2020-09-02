import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button } from '@material-ui/core'

import { normalizeAssociations } from 'views/utils/association-normalizers'
import { searchContacts } from 'actions/contacts'

import { EventDrawer } from 'components/EventDrawer'
import { selectContact } from 'reducers/contacts/list'

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
        <Button
          disabled={disabled}
          variant="outlined"
          size="small"
          onClick={this.openDrawer}
        >
          Create Event
        </Button>
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
