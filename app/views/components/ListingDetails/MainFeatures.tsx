import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles, Theme } from '@material-ui/core'
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

const useStyles = makeStyles(
  (theme: Theme) => ({
    value: {
      color: theme.palette.tertiary.light
    },
    label: {
      color: theme.palette.grey['600']
    }
  }),
  { name: 'MainFeature' }
)

interface Props {
  listing: IListing<'proposed_agent'>
}

function MainFeatures({ listing }: Props) {
  const classes = useStyles()
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
                <Box ml={1}>
                  <Typography variant="button" className={classes.value}>
                    {getFormattedValue(bedroom)}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography
                  color="textSecondary"
                  variant="caption"
                  className={classes.label}
                >
                  Bedroom
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" justifyContent="center">
                <Box display="flex" flexDirection="column">
                  <Box mb={1} display="flex" alignItems="center">
                    <SvgIcon path={mdiShower} />
                    <Box ml={1}>
                      <Tooltip title={getBathroomsTooltip(listing)}>
                        <Typography variant="button" className={classes.value}>
                          {getFormattedValue(bathrooms)}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      color="textSecondary"
                      variant="caption"
                      className={classes.label}
                    >
                      Bathrooms
                    </Typography>
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
                    <Box ml={1}>
                      <Typography variant="button" className={classes.value}>
                        {getFormattedValue(squareFeet)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box textAlign="left">
                    <Typography
                      color="textSecondary"
                      variant="caption"
                      className={classes.label}
                    >
                      Square Feet
                    </Typography>
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
              <Box ml={1}>
                <Typography variant="button" className={classes.value}>
                  {getFormattedValue(lotSize)}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography
                color="textSecondary"
                variant="caption"
                className={classes.label}
              >
                Lot Size
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box mb={1} display="flex" alignItems="center">
                <SvgIcon path={mdiCurrencyUsdCircleOutline} />
                <Box ml={1}>
                  <Typography variant="button" className={classes.value}>
                    {numberToUSD(priceSqft)}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography
                  color="textSecondary"
                  variant="caption"
                  className={classes.label}
                >
                  Price/sqft
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="flex-end">
              <Box display="flex" flexDirection="column">
                <Box mb={1} display="flex" alignItems="center">
                  <SvgIcon path={mdiCalendarMonthOutline} />
                  <Box ml={1}>
                    <Typography variant="button" className={classes.value}>
                      {listing.property.year_built}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography
                    color="textSecondary"
                    variant="caption"
                    className={classes.label}
                  >
                    Built in
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MainFeatures

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
