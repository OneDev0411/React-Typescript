import React from 'react'
import { Box, Typography } from '@material-ui/core'

import { mdiHomeSearchOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

export default function ZeroState() {
  return (
    <Box p={3} textAlign="center" width={1}>
      <SvgIcon path={mdiHomeSearchOutline} size={muiIconSizes.xlarge} />
      <Typography variant="h6">No results found.</Typography>
      <Typography>Try clearing your search or some of your filters.</Typography>
    </Box>
  )
}
