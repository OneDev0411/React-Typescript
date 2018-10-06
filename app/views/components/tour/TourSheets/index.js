import React from 'react'
import PropTypes from 'prop-types'

import BareModal from '../../BareModal'

import { Header } from './Header'
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
  const { tour, listings, handleClose } = props
  const pageTitle = 'Tour Sheets Preview'
  const agent = (tour && tour.created_by) || props.agent

  return (
    <BareModal
      isOpen
      className="c-tour-sheets"
      overlayClassName="c-tour-sheets-modal"
      contentLabel={pageTitle}
      onRequestClose={handleClose}
    >
      <Header
        className="c-tour-sheets-modal__header"
        handleClose={handleClose}
        title={pageTitle}
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
