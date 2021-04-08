import type { Map, Marker, NavigationControl } from 'mapbox-gl'

declare const mapboxgl: {
  accessToken: string
  Map: typeof Map
  Marker: typeof Marker
  NavigationControl: typeof NavigationControl
}

export interface MapInitEventType {
  map: Map
  marker: Marker
  navigationControl: NavigationControl
}

function script({ token, theme, longitude, latitude, zoom }) {
  const element: HTMLElement = this
  const elementId = element.id

  function initMap() {
    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: element instanceof Element ? element : `${elementId}`,
      style: `mapbox://styles/${theme}`,
      center: [longitude, latitude],
      zoom,
      scrollZoom: false
    })

    const marker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map)

    const navigationControl = new mapboxgl.NavigationControl()

    map.addControl(navigationControl)

    element.dispatchEvent(
      new CustomEvent<MapInitEventType>('map:init', {
        detail: { map, marker, navigationControl }
      })
    )
  }

  if (typeof mapboxgl == 'undefined') {
    const script = document.createElement('script')

    script.onload = initMap
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js'
    document.body.appendChild(script)

    const style = document.createElement('link')

    style.href = 'https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css'
    style.rel = 'stylesheet'

    document.body.appendChild(style)
  } else {
    initMap()
  }
}

export default script
