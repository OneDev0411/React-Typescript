import React, { Fragment } from 'react'

import ActionButton from '../Button/ActionButton'

import NewContactDrawer from './NewContactDrawer'

export class CreateContact extends React.Component {
  state = {
    isOpen: false
  }

  handleOpen = () => this.setState({ isOpen: true })

  handleClose = () => this.setState({ isOpen: false })

  render() {
    return (
      <Fragment>
        <ActionButton
          appearance="outline"
          style={{ justifyContent: 'center' }}
          data-test="create-contact-button"
          onClick={this.handleOpen}
        >
          Create Contact
        </ActionButton>

        <NewContactDrawer
          isOpen={this.state.isOpen}
          onClose={this.handleClose}
          submitCallback={this.submitCallback}
          user={this.props.user}
        />
      </Fragment>
    )
  }
}
