import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import {
  mdiBedKingOutline,
  mdiShower,
  mdiVectorSquare,
  mdiCurrencyUsdCircleOutline,
  mdiRelativeScale,
  mdiCalendarMonthOutline
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  listing?: IListing<'proposed_agent'> | null
}

function Header({ listing }: Props) {
  const bedroom = '4'
  const bathrooms = '3'
  const squareFeet = '1024'
  const priceSqft = '$273'
  const lotSizeSqft = '6824'

  return (
    <Box px={3} mb={3}>
      <Grid container>
        <Grid item xs={12}>
          <Box mb={3}>
            <Grid container>
              <Grid item xs={4}>
                <Box mb={1} display="flex" alignItems="center">
                  <SvgIcon path={mdiBedKingOutline} />
                  <Box ml={2}>
                    <Typography variant="subtitle1">{bedroom}</Typography>
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
                        <Typography variant="subtitle1">{bathrooms}</Typography>
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
                          {squareFeet.toLocaleString()}
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
                    {lotSizeSqft.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography color="textSecondary">Lot Size sqft</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box mb={1} display="flex" alignItems="center">
                  <SvgIcon path={mdiCurrencyUsdCircleOutline} />
                  <Box ml={2}>
                    <Typography variant="subtitle1">{priceSqft}</Typography>
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
                        {listing?.property.year_built}
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
    </Box>
  )
}

export default Header
