import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import ActionButton from '../../Button/ActionButton'

import { TourSheets } from '../TourSheets'

const propTypes = {
  agent: PropTypes.shape().isRequired,
  appearance: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  style: PropTypes.shape(),
  title: PropTypes.string,
  tour: PropTypes.shape(),
  tourFormDate: PropTypes.shape()
}

const defaultProps = {
  appearance: 'outline',
  disabled: false,
  size: 'medium',
  style: {},
  tour: {},
  tourFormDate: {},
  title: 'Preview'
}

export class PreviewTourSheets extends React.Component {
  state = {
    isOpen: false
  }

  handleOpen = () => this.setState({ isOpen: true })
  handleClose = () => this.setState({ isOpen: false })

  render() {
    return (
      <Fragment>
        <ActionButton
          appearance={this.props.appearance}
          disabled={this.props.disabled}
          onClick={this.handleOpen}
          size={this.props.size}
          style={this.props.style}
        >
          {this.props.title}
        </ActionButton>

        {this.state.isOpen && (
          <TourSheets
            agent={this.props.user}
            isOpen
            onRequestClose={this.handleClose}
            tour={this.props.tour}
            tourFormDate={this.props.tourFormDate}
          />
        )}
      </Fragment>
    )
  }
}

PreviewTourSheets.propTypes = propTypes
PreviewTourSheets.defaultProps = defaultProps
