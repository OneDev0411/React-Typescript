import React from 'react'

import { Divider, createStyles, makeStyles, Theme } from '@material-ui/core'

import { getDealAddress } from 'deals/utils/get-deal-address'

import MlsConnect from './MlsConnect'
import Side from './Side'
import PropertyType from './PropertyType'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    divider: {
      margin: theme.spacing(0, 1),
      height: theme.spacing(2.5)
    }
  })
})

export function ListingProperties(props: Props) {
  const classes = useStyles()
  const address = getDealAddress(props.deal)

  return (
    <div className={classes.root}>
      {address}
      {address.length > 0 && (
        <Divider orientation="vertical" className={classes.divider} />
      )}

      <Side deal={props.deal} isBackOffice={props.isBackOffice} />

      <Divider orientation="vertical" className={classes.divider} />

      <PropertyType deal={props.deal} isBackOffice={props.isBackOffice} />

      <Divider orientation="vertical" className={classes.divider} />

      <MlsConnect deal={props.deal} />
    </div>
  )
}
