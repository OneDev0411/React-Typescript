import React, { Fragment } from 'react'

import { Button, Tooltip } from '@material-ui/core'
import PropTypes from 'prop-types'

import { TourSheets } from '../TourSheets'

const propTypes = {
  agent: PropTypes.shape().isRequired,
  appearance: PropTypes.string,
  disabled: PropTypes.bool,
  listings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  size: PropTypes.string,
  style: PropTypes.shape(),
  title: PropTypes.string,
  tour: PropTypes.shape()
}

const defaultProps = {
  appearance: 'outline',
  disabled: false,
  size: 'medium',
  style: {},
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
        <Tooltip placement="top" title="Preview and print tour sheets">
          <Button
            disabled={this.props.disabled}
            onClick={this.handleOpen}
            variant="outlined"
          >
            {this.props.title}
          </Button>
        </Tooltip>

        {this.state.isOpen && (
          <TourSheets
            agent={this.props.agent}
            isOpen
            handleClose={this.handleClose}
            tour={this.props.tour}
            listings={this.props.listings}
          />
        )}
      </Fragment>
    )
  }
}

PreviewTourSheets.propTypes = propTypes
PreviewTourSheets.defaultProps = defaultProps
