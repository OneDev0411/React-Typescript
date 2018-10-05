import React from 'react'
import PropTypes from 'prop-types'

import BareModal from '../../BareModal'
import { FullPageHeader } from '../../FullPageHeader'

import { CoverPage } from './CoverPage'
import './style.scss'

const propTypes = {
  agent: PropTypes.shape().isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  tour: PropTypes.shape(),
  tourFormDate: PropTypes.shape()
}

export class TourSheets extends React.Component {
  render() {
    const { agent, tourFormDate } = this.props
    const pageTitle = 'Tour Sheets Preview'

    return (
      <BareModal
        isOpen
        className="c-tour-sheets"
        contentLabel={pageTitle}
        onRequestClose={this.props.handleClose}
      >
        <FullPageHeader
          title={pageTitle}
          handleClose={this.props.handleClose}
          style={{
            position: 'fixed',
            width: '100%',
            margin: 0,
            padding: '2.5rem'
          }}
        />
        <CoverPage tour={tourFormDate} agent={agent} />
      </BareModal>
    )
  }
}

TourSheets.propTypes = propTypes
