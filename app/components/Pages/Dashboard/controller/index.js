// controller/index.js
// Listing
import listing_map from './listing-map'
import listing_share from './listing-share'
import listing_viewer from './listing-viewer'
import listing_panel from './listing-panel'
import listing_filter from './listing-filter'
import listing_card from './listing-card'
// Share modal
import share_modal from './share-modal'
// Alert
import alert_modal from './alert-modal'
import alert_viewer from './alert-viewer'
import alert_map from './alert-map'
import alert_share from './alert-share'
// Rooms
import recents from './recents'
// combine controllers
const controller = {
  listing_map,
  listing_share,
  listing_viewer,
  listing_panel,
  listing_filter,
  listing_card,
  share_modal,
  alert_modal,
  alert_viewer,
  alert_map,
  alert_share,
  recents
}
export default controller