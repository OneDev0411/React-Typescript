import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import ActionButton from '../../Button/ActionButton'

import { OpenHouseDrawer } from '../OpenHouseDrawer'

const propTypes = {
  associations: PropTypes.shape({
    deal: PropTypes.shape(),
    listing: PropTypes.shape()
  }).isRequired,
  style: PropTypes.shape(),
  user: PropTypes.shape().isRequired,
  children: PropTypes.object
}

const defaultProps = {
  style: {}
}

export class CreateOpenHouse extends React.Component {
  state = {
    isOpen: false
  }

  handleOpen = () => this.setState({ isOpen: true })

  handleClose = () => this.setState({ isOpen: false })

  handleSubmitCallback = event => {
    if (this.props.submitCallback) {
      this.props.submitCallback(event)
    }

    this.handleClose()
  }

  render() {
    return (
      <Fragment>
        {this.props.children ? (
          React.cloneElement(this.props.children, {
            onClick: this.handleOpen
          })
        ) : (
          <ActionButton
            appearance="outline"
            onClick={this.handleOpen}
            style={this.props.style}
          >
            Create OH Event
          </ActionButton>
        )}

        {this.state.isOpen && (
          <OpenHouseDrawer
            isOpen
            user={this.props.user}
            onClose={this.handleClose}
            associations={this.props.associations}
            submitCallback={this.handleSubmitCallback}
          />
        )}
      </Fragment>
    )
  }
}

CreateOpenHouse.propTypes = propTypes
CreateOpenHouse.defaultProps = defaultProps
