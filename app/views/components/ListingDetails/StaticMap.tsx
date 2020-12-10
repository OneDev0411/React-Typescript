import React, { useMemo } from 'react'

import { getGoogleMapStaticImageSrc } from 'utils/get-google-static-map-url'

interface Props {
  location: ILocation
}

function StaticMap({ location }: Props) {
  const image: string = useMemo(
    () =>
      getGoogleMapStaticImageSrc({
        location,
        height: 150,
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
    <a href="#listing-map">
      <img alt="logo" src={image} style={{ width: '100%' }} />
    </a>
  )
}

export default StaticMap
