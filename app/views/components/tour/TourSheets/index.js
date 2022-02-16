import { useMemo } from 'react'

import PropTypes from 'prop-types'

import usePrintLayout from '@app/hooks/use-print-layout'

import BareModal from '../../BareModal'

import { CoverPage } from './CoverPage'
import { Header } from './Header'
import { LocationPage } from './LocationPage'

import './styles/main.scss'

TourSheets.propTypes = {
  agent: PropTypes.shape(),
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  listings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tour: PropTypes.oneOfType([null, PropTypes.shape()]).isRequired
}

export function TourSheets(props) {
  usePrintLayout('portrait')

  const { tour, listings, handleClose } = props
  const pageTitle = 'Tour Sheets Preview'

  const tourSheetAgent = useMemo(() => {
    let agent = tour && tour.created_by

    if (!agent || agent.id === props.agent.id) {
      agent = props.agent
    }

    return agent
  }, [props.agent, tour])

  return (
    <>
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
        <CoverPage tour={tour} listings={listings} agent={tourSheetAgent} />
        {listings.map((listing, index) => (
          <LocationPage
            key={index}
            index={index}
            listing={listing}
            tour={tour}
            agent={tourSheetAgent}
          />
        ))}
      </BareModal>
    </>
  )
}
