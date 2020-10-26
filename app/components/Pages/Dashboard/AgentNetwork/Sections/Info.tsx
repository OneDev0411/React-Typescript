import React from 'react'
import {
  Grid,
  Box,
  Typography,
  Hidden,
  makeStyles,
  useTheme
} from '@material-ui/core'
import {
  mdiHomeSearchOutline,
  mdiClipboardListOutline,
  mdiCheck,
  mdiArrowRight
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  () => ({
    stepsContainer: {
      textAlign: 'center'
    }
  }),
  {
    name: 'AgentNetworkInfoSection'
  }
)

export default function Info() {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Box pb={6}>
            <Typography variant="h4">
              One Click Marketing to Agents from Any Brokerage
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box py={6}>
        <Grid container justify="center" className={classes.stepsContainer}>
          <Grid item xs={12} md={3}>
            <div>
              <SvgIcon
                path={mdiHomeSearchOutline}
                color={theme.palette.primary.main}
                size={muiIconSizes.large}
              />
            </div>
            <Typography variant="h6">Select a Listing or Address</Typography>
            <Typography variant="body2">
              Search for an address or MLS# or select from your current listings
            </Typography>
          </Grid>
          <Hidden smDown>
            <Grid item md={1}>
              <SvgIcon
                path={mdiArrowRight}
                color={theme.palette.grey[300]}
                size={muiIconSizes.large}
              />
            </Grid>
          </Hidden>
          <Grid item xs={12} md={3}>
            <div>
              <SvgIcon
                path={mdiClipboardListOutline}
                color={theme.palette.primary.main}
                size={muiIconSizes.large}
              />
            </div>
            <Typography variant="h6">Select Top Agents</Typography>
            <Typography variant="body2">
              Set filters like price, beds, baths and ... to find better results
            </Typography>
          </Grid>
          <Hidden smDown>
            <Grid item md={1}>
              <SvgIcon
                path={mdiArrowRight}
                color={theme.palette.grey[300]}
                size={muiIconSizes.large}
              />
            </Grid>
          </Hidden>
          <Grid item xs={12} md={3}>
            <div>
              <SvgIcon
                path={mdiCheck}
                color={theme.palette.primary.main}
                size={muiIconSizes.large}
              />
            </div>
            <Typography variant="h6">Send Beautiful Marketing</Typography>
            <Typography variant="body2">
              Choose who you want to send a promotion email. then with our
              awesome marketing tools you can promote your listings
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
