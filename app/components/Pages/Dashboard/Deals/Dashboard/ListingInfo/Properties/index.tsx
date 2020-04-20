import React from 'react'

import { Divider, createStyles, makeStyles, Theme } from '@material-ui/core'

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
      alignItems: 'center',
      ...theme.typography.body2,
      fontWeight: 700
    },
    divider: {
      margin: theme.spacing(0, 1),
      height: theme.spacing(2.5)
    }
  })
})

export function ListingProperties(props: Props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Side deal={props.deal} isBackOffice={props.isBackOffice} />
      <Divider orientation="vertical" className={classes.divider} />
      <PropertyType deal={props.deal} isBackOffice={props.isBackOffice} />
      <Divider orientation="vertical" className={classes.divider} />
      <MlsConnect deal={props.deal} />
    </div>
  )
}
