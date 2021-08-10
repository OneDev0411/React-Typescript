import React from 'react'

import { Box, makeStyles, Theme } from '@material-ui/core'

import Address from './Address'
import { ListingImage } from './Image'
import { Menu } from './Menu'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  info: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: theme.spacing(0, 0, 2, 0)
  }
}))

export function PageHeader({ deal, isBackOffice }: Props) {
  const classes = useStyles()

  return (
    <Box pt={3} px={5}>
      <div className={classes.info}>
        <Box display="flex" alignItems="center">
          <ListingImage deal={deal} />

          <Box px={2}>
            <Address deal={deal} />
          </Box>
        </Box>

        <Menu deal={deal} isBackOffice={isBackOffice} />
      </div>
    </Box>
  )
}
