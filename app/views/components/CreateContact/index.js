import React from 'react'

import { Button } from '@material-ui/core'

import NewContactDrawer from './NewContactDrawer'

export class CreateContact extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  toggleOpen = () => this.setState(prevState => ({ isOpen: !prevState.isOpen }))

  render() {
    return (
      <>
        <Button
          variant="outlined"
          data-test="create-contact-button"
          onClick={this.toggleOpen}
          {...this.props.buttonProps}
        >
          Create Contact
        </Button>

        <NewContactDrawer
          isOpen={this.state.isOpen}
          onClose={this.toggleOpen}
          submitCallback={this.props.submitCallback}
          user={this.props.user}
          showAddAnother={this.props.showAddAnother}
        />
      </>
    )
  }
}
