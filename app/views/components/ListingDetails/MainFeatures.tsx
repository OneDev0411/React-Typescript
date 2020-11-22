import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import {
  mdiBedKingOutline,
  mdiShower,
  mdiVectorSquare,
  mdiCurrencyUsdCircleOutline,
  mdiRelativeScale,
  mdiCalendarMonthOutline
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import listingUtils from 'utils/listing'
import { numberToUSD } from 'utils/number-to-usd'

interface Props {
  listing: IListing<'proposed_agent'>
}

function Header({ listing }: Props) {
  const property = listing.property
  const bedroom = property.bedroom_count
  const bathrooms = property.bathroom_count
  const squareFeet = Math.floor(
    listingUtils.metersToFeet(property.square_meters)
  )
  const priceSqft = Math.round(listing.price / squareFeet)
  const lotSize = property.lot_size_area

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box mb={3}>
          <Grid container>
            <Grid item xs={4}>
              <Box mb={1} display="flex" alignItems="center">
                <SvgIcon path={mdiBedKingOutline} />
                <Box ml={2}>
                  <Typography variant="subtitle1">
                    {getFormattedValue(bedroom)}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography color="textSecondary">Bedroom</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" justifyContent="center">
                <Box display="flex" flexDirection="column">
                  <Box mb={1} display="flex" alignItems="center">
                    <SvgIcon path={mdiShower} />
                    <Box ml={2}>
                      <Tooltip title={getBathroomsTooltip(listing)}>
                        <Typography variant="subtitle1">
                          {getFormattedValue(bathrooms)}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box>
                    <Typography color="textSecondary">Bathrooms</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" justifyContent="flex-end">
                <Box display="flex" flexDirection="column">
                  <Box
                    mb={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <SvgIcon path={mdiVectorSquare} />
                    <Box ml={2}>
                      <Typography variant="subtitle1">
                        {getFormattedValue(squareFeet)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box textAlign="left">
                    <Typography color="textSecondary">Square Feet</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={4}>
            <Box mb={1} display="flex" alignItems="center">
              <SvgIcon path={mdiRelativeScale} />
              <Box ml={2}>
                <Typography variant="subtitle1">
                  {getFormattedValue(lotSize)}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography color="textSecondary">Lot Size</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box mb={1} display="flex" alignItems="center">
                <SvgIcon path={mdiCurrencyUsdCircleOutline} />
                <Box ml={2}>
                  <Typography variant="subtitle1">
                    {numberToUSD(priceSqft)}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography color="textSecondary">Price/sqft</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="flex-end">
              <Box display="flex" flexDirection="column">
                <Box mb={1} display="flex" alignItems="center">
                  <SvgIcon path={mdiCalendarMonthOutline} />
                  <Box ml={2}>
                    <Typography variant="subtitle1">
                      {listing.property.year_built}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography color="textSecondary">Built in</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Header

function getBathroomsTooltip(listing: IListing): string {
  const fullCounts = listing.property.full_bathroom_count
  const halfCounts = listing.property.half_bathroom_count
  const fullText = fullCounts != null ? `${fullCounts} Full Bath` : ''
  const halfText = halfCounts != null ? `${halfCounts} Half Bath` : ''

  return [fullText, halfText].filter(Boolean).join(' + ')
}

function getFormattedValue(value: string | number | null | undefined): string {
  if (!value) {
    return 'N/A'
  }

  if (typeof value === 'number') {
    return value.toLocaleString()
  }

  return value
}
