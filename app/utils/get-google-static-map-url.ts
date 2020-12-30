import config from '../../config/public'

type MapType = 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
type Colors = 'black'
  | 'brown'
  | 'green'
  | 'purple'
  | 'yellow'
  | 'blue'
  | 'gray'
  | 'orange'
  | 'red'
  | 'white'

type Marker = {
  label?: string
  color?: Colors
  location: ILocation
  size?: 'tiny' | 'mid' | 'small'
}

type GetGoogleMapStaticImageSrc = {
  location: ILocation
  zoom?: number
  width?: number,
  height?: number,
  mapType?: MapType,
  markers?: Marker[]
}

export function getGoogleMapStaticImageSrc({
  location,
  zoom = 15,
  width = 600,
  height = 300,
  mapType = 'roadmap',
  markers = []
}: GetGoogleMapStaticImageSrc): string {
  const center = `${location.latitude},${location.longitude}`
  const encodedMarkers = markers
    .map(marker =>
      encodeURI(
        `markers=size:${marker.size ?? 'mid'}|color:${marker.color ?? 'red'}|label:${(marker.label ?? '')
          .substring(0, 1)
          .toUpperCase()}|${marker.location.latitude},${
          marker.location.longitude
        }`
      )
    )
    .join('&')

  const src = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${width}x${height}&maptype=${mapType}
    &${encodedMarkers}&key=${config.google.api_key}`

  return src
}
