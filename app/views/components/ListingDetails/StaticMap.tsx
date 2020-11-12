import React, { useMemo } from 'react'
import Box from '@material-ui/core/Box'
// import { useMediaQuery, useTheme, Theme } from '@material-ui/core'

import { getGoogleMapStaticImageSrc } from 'utils/get-google-static-map-url'

interface Props {
  location: ILocation
}

function StaticMap({ location }: Props) {
  // const theme: Theme = useTheme()
  // const isDesktop = useMediaQuery(
  //   `(min-width:${theme.breakpoints.values.lg}px)`
  // )
  const image: string = useMemo(
    () =>
      getGoogleMapStaticImageSrc({
        location,
        height: 150,
        // width: isDesktop ? window.innerWidth / 2 : 600,
        zoom: 18,
        markers: [
          {
            color: 'blue',
            label: 'A',
            location
          }
        ]
      }),
    [location]
  )

  return (
    <Box py={5} px={3} height={300}>
      <a href="#map">
        <img alt="logo" src={image} style={{ maxWidth: '100%' }} />
      </a>
    </Box>
  )
}

export default StaticMap
