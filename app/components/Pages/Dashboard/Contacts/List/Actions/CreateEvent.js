import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { Button } from '@material-ui/core'

import { normalizeAssociations } from 'views/utils/association-normalizers'
import { searchContacts } from 'actions/contacts'

import { EventDrawer } from 'components/EventDrawer'
import { selectContact } from 'reducers/contacts/list'

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

  onEventSubmit = async () => {
    this.closeDrawer()
    await this.props.submitCallback()
  }

  render() {
    const { user, associations, disabled } = this.props

    return (
      <Fragment>
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
  {
    searchContacts
  }
)(CreateEvent)
