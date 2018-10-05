import React from 'react'
import PropTypes from 'prop-types'

import BareModal from '../../BareModal'

import { CoverPage } from './CoverPage'

const propTypes = {
  agent: PropTypes.shape().isRequired,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  tour: PropTypes.shape(),
  tourFormDate: PropTypes.shape()
}

export class TourSheets extends React.Component {
  render() {
    const { agent, tourFormDate } = this.props

    return (
      <BareModal
        isOpen={this.props.isOpen}
        className="c-tour-sheets"
        contentLabel="Tour Sheets"
        onRequestClose={this.props.onRequestClose}
      >
        <CoverPage tour={tourFormDate} agent={agent} />
      </BareModal>
    )
  }
}

TourSheets.propTypes = propTypes
