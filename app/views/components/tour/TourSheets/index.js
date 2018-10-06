import React from 'react'
import PropTypes from 'prop-types'

import BareModal from '../../BareModal'
import { FullPageHeader } from '../../FullPageHeader'

import { CoverPage } from './CoverPage'
import { LocationPage } from './LocationPage'
import './style.scss'

TourSheets.propTypes = {
  agent: PropTypes.shape(),
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  listings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tour: PropTypes.shape().isRequired
}

export function TourSheets(props) {
  const { tour, listings } = props
  const pageTitle = 'Tour Sheets Preview'
  const agent = (tour && tour.created_by) || props.agent

  return (
    <BareModal
      isOpen
      className="c-tour-sheets"
      overlayClassName="c-tour-sheets-modal"
      contentLabel={pageTitle}
      onRequestClose={props.handleClose}
    >
      <FullPageHeader
        title={pageTitle}
        handleClose={props.handleClose}
        className="c-tour-sheets-modal__header"
        style={{
          position: 'fixed',
          width: '100%',
          margin: 0,
          top: 0,
          left: 0,
          right: 0,
          padding: '1.5rem',
          backgroundColor: '#FFF',
          zIndex: 1
        }}
      />
      <CoverPage tour={tour} listings={listings} agent={agent} />
      {listings.map((listing, index) => (
        <LocationPage
          key={index}
          index={index}
          listing={listing}
          tour={tour}
          agent={agent}
        />
      ))}
    </BareModal>
  )
}
