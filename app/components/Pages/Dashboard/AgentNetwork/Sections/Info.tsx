import React from 'react'
import {
  Grid,
  Box,
  Typography,
  Hidden,
  Theme,
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
  (theme: Theme) => ({
    container: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    }
  }),
  {
    name: 'AgentNetworkInfoSection'
  }
)

export default function Info() {
  const theme = useTheme()
  const classes = useStyles()

  return (
    <Box py={6} mb={3} textAlign="center" className={classes.container}>
      <Grid container alignItems="center" justify="center">
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
            Search for an address or MLS# or select from your current listings.
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
            Set filters like price, beds, baths to find better results.
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
            Choose who you want to send a promotion email, customize your
            template and send it right away!
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
