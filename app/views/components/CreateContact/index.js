import React, { Fragment } from 'react'

import { Button } from '@material-ui/core'

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
        <Button
          variant="outlined"
          data-test="create-contact-button"
          onClick={this.handleOpen}
        >
          Create Contact
        </Button>

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
