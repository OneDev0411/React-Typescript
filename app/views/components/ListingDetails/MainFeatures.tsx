import {
  makeStyles,
  Theme,
  Box,
  Grid,
  Tooltip,
  Typography
} from '@material-ui/core'
import {
  mdiBedKingOutline,
  mdiShower,
  mdiVectorSquare,
  mdiCurrencyUsdCircleOutline,
  mdiRelativeScale,
  mdiCalendarMonthOutline
} from '@mdi/js'
import pluralize from 'pluralize'

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

  const isLand = property.property_type === 'Lots & Acreage'

  const bedroom = property.bedroom_count
  const bathrooms = property.bathroom_count
  const squareFeet = Math.round(
    listingUtils.metersToFeet(property.square_meters)
  )
  const priceSqft = squareFeet > 0 ? Math.round(listing.price / squareFeet) : 0
  const lotSize = property.lot_size_area

  // We don't have bath or bed counts for land, so we'll just show the property type
  if (isLand) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Box mb={3}>
            <Typography className={classes.label} variant="h5">
              Land
            </Typography>
          </Box>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box mb={3}>
          <Grid container>
            <Grid item xs={4}>
              <Box display="flex" alignItems="flex-start">
                <SvgIcon path={mdiBedKingOutline} />
                <Box ml={1}>
                  <Typography variant="subtitle1" className={classes.value}>
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
              <Box display="flex" justifyContent="flex-start">
                <Box display="flex" flexDirection="column">
                  <Box display="flex" alignItems="center">
                    <SvgIcon path={mdiShower} />
                    <Box ml={1}>
                      <Tooltip title={getBathroomsTooltip(listing)}>
                        <Typography
                          variant="subtitle1"
                          className={classes.value}
                        >
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
              <Box display="flex" justifyContent="flex-start">
                <Box display="flex" flexDirection="column">
                  <Box display="flex" alignItems="center">
                    <SvgIcon path={mdiCalendarMonthOutline} />
                    <Box ml={1}>
                      <Typography variant="subtitle1" className={classes.value}>
                        {listing.property.year_built || '--'}
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
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={4}>
            <Box display="flex" alignItems="flex-start">
              <SvgIcon path={mdiRelativeScale} />
              <Box ml={1}>
                <Typography variant="subtitle1" className={classes.value}>
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
            <Box display="flex" justifyContent="flex-start">
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <SvgIcon path={mdiVectorSquare} />
                  <Box ml={1}>
                    <Typography variant="subtitle1" className={classes.value}>
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
          <Grid item xs={4}>
            <Box display="flex" justifyContent="flex-start">
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <SvgIcon path={mdiCurrencyUsdCircleOutline} />
                  <Box ml={1}>
                    <Typography variant="subtitle1" className={classes.value}>
                      {priceSqft > 0 ? numberToUSD(priceSqft) : '--'}
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
  const fullText = fullCounts
    ? `${fullCounts} Full ${pluralize('Bath', fullCounts)}`
    : ''
  const halfText = halfCounts
    ? `${halfCounts} Half ${pluralize('Bath', halfCounts)}`
    : ''

  return [fullText, halfText].filter(Boolean).join(' + ')
}

function getFormattedValue(value: string | number | null | undefined): string {
  if (!value) {
    return '--'
  }

  if (typeof value === 'number') {
    return value.toLocaleString()
  }

  return value
}
