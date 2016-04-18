// controller/index.js
// Listing
import listing_map from './listing-map'
import listing_share from './listing-share'
import listing_viewer from './listing-viewer'
import listing_panel from './listing-panel'
import listing_filter from './listing-filter'
// Share modal
import share_modal from './share-modal'
// Alert
import alert_viewer from './alert-viewer'
// Rooms
import recents from './recents'
// Mobile
import mobile from './mobile'
// combine controllers
const controller = {
  listing_map,
  listing_share,
  listing_viewer,
  listing_panel,
  listing_filter,
  share_modal,
  alert_viewer,
  recents,
  mobile
}
export default controller