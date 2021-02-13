declare const mapboxgl: any

function script({ token, theme, longitude, latitude, zoom }) {
  const element = this

  function initMap() {
    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: element.id,
      style: theme,
      center: [longitude, latitude],
      zoom,
      interactive: false
    })

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map)
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
