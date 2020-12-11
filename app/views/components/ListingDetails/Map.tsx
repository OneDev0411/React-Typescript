import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles, Theme } from '@material-ui/core'

import { SingleMarkerMap } from 'components/maps/SingleMarkerMap'

const useStyles = makeStyles(
  (theme: Theme) => ({
    box: {
      width: '100%',
      height: 230,
      [theme.breakpoints.up('lg')]: {
        height: 600
      }
    }
  }),
  { name: 'Map' }
)

interface Props {
  location: ILocation
}

function Map({ location }: Props) {
  const classes = useStyles()

  return (
    <Box id="listing-map" className={classes.box}>
      <SingleMarkerMap
        id="listingMap"
        location={location}
        options={{ zoom: 16 }}
      />
    </Box>
  )
}

export default Map
