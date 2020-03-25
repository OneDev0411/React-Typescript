import React from 'react'
import { Box, makeStyles, createStyles, Theme } from '@material-ui/core'

import { Menu } from './Menu'

import { ListingInfo } from '../ListingInfo'
import { ListingProperties } from '../ListingInfo/Properties'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    info: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: theme.spacing(0, 0, 2, 0)
    }
  })
})

export function PageHeader({ deal, isBackOffice }: Props) {
  const classes = useStyles()

  return (
    <Box py={3} px={5}>
      <div className={classes.info}>
        <ListingInfo deal={deal} isBackOffice={isBackOffice} />
        <Menu deal={deal} isBackOffice={isBackOffice} />
      </div>

      <ListingProperties deal={deal} isBackOffice={isBackOffice} />
    </Box>
  )
}
