import React from 'react'

import { Link } from 'react-router'
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
      alignItems: 'center',
      paddingLeft: theme.spacing(10)
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

      {/* 
      // @ts-ignore js component */}
      <Side deal={props.deal} isBackOffice={props.isBackOffice} />

      <Divider orientation="vertical" className={classes.divider} />

      {/* 
      // @ts-ignore js component */}
      <PropertyType deal={props.deal} isBackOffice={props.isBackOffice} />

      <Divider orientation="vertical" className={classes.divider} />

      {/* 
      // @ts-ignore js component */}
      <MlsConnect deal={props.deal} />

      {props.deal.listing && (
        <>
          <Divider orientation="vertical" className={classes.divider} />
          <Link to={`/dashboard/mls/${props.deal.listing}`}>View MLS</Link>
        </>
      )}
    </div>
  )
}
