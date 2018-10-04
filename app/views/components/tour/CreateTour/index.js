import React, { Fragment } from 'react'

import ActionButton from '../../../../views/components/Button/ActionButton'

import { TourDrawer } from '../TourDrawer'

export class CreateTour extends React.Component {
  state = {
    isOpen: false
  }

  handleOpen = () => this.setState({ isOpen: true })
  handleClose = () => this.setState({ isOpen: false })

  render() {
    return (
      <Fragment>
        <ActionButton
          size="small"
          appearance="outline"
          onClick={this.handleOpen}
        >
          Create Tour Sheets
        </ActionButton>

        {this.state.isOpen && (
          <TourDrawer
            isOpen
            user={this.props.user}
            onClose={this.handleClose}
            listings={this.props.listings}
            submitCallback={this.handleClose}
          />
        )}
      </Fragment>
    )
  }
}
