import React, { Fragment } from 'react'

import ActionButton from '../../Button/ActionButton'
import { resetGridSelectedItems } from '../../Grid/Table/Plugins/Selectable'

import { TourDrawer } from '../TourDrawer'

export class CreateTour extends React.Component {
  state = {
    isOpen: false
  }

  handleOpen = () => this.setState({ isOpen: true })
  handleClose = () => this.setState({ isOpen: false })

  submitCallback = () => {
    this.handleClose()
    resetGridSelectedItems('listings')
  }

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
            submitCallback={this.submitCallback}
          />
        )}
      </Fragment>
    )
  }
}
