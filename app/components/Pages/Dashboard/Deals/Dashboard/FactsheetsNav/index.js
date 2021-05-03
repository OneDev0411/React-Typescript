import PropTypes from 'prop-types'
import { Box, IconButton } from '@material-ui/core'

import { mdiCogOutline } from '@mdi/js'

import Spinner from 'components/Spinner'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import FactsheetSection from '../Factsheet'
import Roles from '../../components/Roles'
import DeleteDeal from '../DeleteDeal'
import { DealProperties } from '../DealProperties'

import { Card } from './styled'

function FactsheetsSideNav(props) {
  const { deal, isBackOffice } = props

  return (
    <Card style={props.style}>
      {props.isFetchingContexts ? (
        <Spinner />
      ) : (
        <>
          <Box mb={6}>
            <FactsheetSection
              display={props.showCriticalDates}
              deal={deal}
              isFetchingContexts={props.isFetchingContexts}
              isBackOffice={isBackOffice}
              section="Dates"
              title={
                <Box display="flex" alignItems="center">
                  Timeline
                  <Box ml={0.25}>
                    <IconButton
                      size="small"
                      href="/dashboard/account/reminder-notifications"
                      target="_blank"
                    >
                      <SvgIcon path={mdiCogOutline} size={muiIconSizes.small} />
                    </IconButton>
                  </Box>
                </Box>
              }
            />
          </Box>

          <Box mb={6}>
            <DealProperties deal={deal} isBackOffice={isBackOffice} />
          </Box>

          {props.showContacts && (
            <Box mb={6}>
              <Roles deal={deal} allowDeleteRole />
            </Box>
          )}

          <Box mb={6}>
            <FactsheetSection
              display={props.showCDAInformation}
              deal={deal}
              isFetchingContexts={props.isFetchingContexts}
              isBackOffice={isBackOffice}
              section="CDA"
              title="CDA Information"
            />
          </Box>

          <Box mb={6}>
            <FactsheetSection
              display={props.showListingInformation}
              deal={deal}
              isFetchingContexts={props.isFetchingContexts}
              isBackOffice={isBackOffice}
              section="Listing"
              title="Listing Information"
            />
          </Box>

          {props.showDeleteDeal && (
            <Box mx={2}>
              <DeleteDeal deal={deal} isBackOffice={isBackOffice} />
            </Box>
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
