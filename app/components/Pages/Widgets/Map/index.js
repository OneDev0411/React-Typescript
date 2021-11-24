import SearchMap from '../../Dashboard/MLS/ExploreTab'

const MapWidget = props => (
  <div className="l-listings is-widget">
    <SearchMap {...props} isWidget />
  </div>
)

export default MapWidget
