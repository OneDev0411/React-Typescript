import PropTypes from 'prop-types'

import Spinner from 'components/Spinner'

import FactsheetSection from '../Factsheet'
import Roles from '../../components/Roles'
import DeleteDeal from '../DeleteDeal'
import { Card } from './styled'

function FactsheetsSideNav(props) {
  const { deal, isBackOffice } = props

  return (
    <Card style={props.style}>
      {props.isFetchingContexts ? (
        <Spinner />
      ) : (
        <>
          <FactsheetSection
            display={props.showCriticalDates}
            deal={deal}
            isFetchingContexts={props.isFetchingContexts}
            isBackOffice={isBackOffice}
            section="Dates"
            title="Critical Dates"
          />

          {props.showContacts && <Roles deal={deal} allowDeleteRole />}

          <FactsheetSection
            display={props.showCDAInformation}
            deal={deal}
            isFetchingContexts={props.isFetchingContexts}
            isBackOffice={isBackOffice}
            section="CDA"
            title="CDA Information"
          />

          <FactsheetSection
            display={props.showListingInformation}
            deal={deal}
            isFetchingContexts={props.isFetchingContexts}
            isBackOffice={isBackOffice}
            section="Listing"
            title="Listing Information"
          />

          {props.showDeleteDeal && (
            <div
              style={{
                margin: '0.5rem 1.5rem'
              }}
            >
              <DeleteDeal deal={deal} isBackOffice={isBackOffice} />
            </div>
          )}
        </>
      )}
    </Card>
  )
}

FactsheetsSideNav.propTypes = {
  deal: PropTypes.object.isRequired,
  isBackOffice: PropTypes.bool.isRequired,
  isFetchingContexts: PropTypes.bool.isRequired,
  showCriticalDates: PropTypes.bool,
  showCriticalDatesDivider: PropTypes.bool,
  showCDAInformation: PropTypes.bool,
  showListingInformation: PropTypes.bool,
  showContacts: PropTypes.bool,
  showDeleteDeal: PropTypes.bool
}

FactsheetsSideNav.defaultProps = {
  showCriticalDates: true,
  showCriticalDatesDivider: true,
  showCDAInformation: true,
  showListingInformation: true,
  showContacts: true,
  showDeleteDeal: true
}

export default FactsheetsSideNav
