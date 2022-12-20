import { Box, IconButton } from '@material-ui/core'
import { mdiBellOutline } from '@mdi/js'
import PropTypes from 'prop-types'

import Spinner from 'components/Spinner'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import Roles from '../../components/Roles'
import { DealProperties } from '../DealProperties'
import DeleteDeal from '../DeleteDeal'
import { ExportDeal } from '../ExportDeal'
import FactsheetSection from '../Factsheet'

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
                      <SvgIcon
                        path={mdiBellOutline}
                        size={muiIconSizes.small}
                      />
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
              <Roles deal={deal} allowDeleteRole allowEditRole />
            </Box>
          )}

          <Box mb={6}>
            <FactsheetSection
              display={props.showCDAInformation}
              deal={deal}
              isBackOffice={isBackOffice}
              section="CDA"
              title="CDA Information"
            />
          </Box>

          <Box mb={6}>
            <FactsheetSection
              display={props.showListingInformation}
              deal={deal}
              isBackOffice={isBackOffice}
              section="Listing"
              title="Listing Information"
            />
          </Box>

          {props.showDeleteDeal && (
            <Box mx={2}>
              <Box mb={1}>
                <ExportDeal deal={deal} />
              </Box>

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
  isFetchingContexts: PropTypes.bool,
  showCriticalDates: PropTypes.bool,
  showCriticalDatesDivider: PropTypes.bool,
  showCDAInformation: PropTypes.bool,
  showListingInformation: PropTypes.bool,
  showContacts: PropTypes.bool,
  showDeleteDeal: PropTypes.bool
}

FactsheetsSideNav.defaultProps = {
  isFetchingContexts: false,
  showCriticalDates: true,
  showCriticalDatesDivider: true,
  showCDAInformation: true,
  showListingInformation: true,
  showContacts: true,
  showDeleteDeal: true
}

export default FactsheetsSideNav
