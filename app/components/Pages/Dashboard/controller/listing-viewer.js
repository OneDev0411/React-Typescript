// controller/listing-viewer.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
const controller = {
  showListingViewer(listing) {
    const data = AppStore.data
    // Check for subdomain
    const host = window.location.host
    console.log(host)
    if (data.is_widget && data.brand && data.brand.subdomain) {
      const host = window.location.host
      window.open(host + '/dashboard/mls/' + listing.id)
      return
    }
    const history = require('../../../../utils/history')
    history.pushState(null, '/dashboard/mls/' + listing.id)
    const user = data.user
    AppStore.data.show_listing_viewer = true
    AppStore.data.current_listing = listing
    delete AppStore.data.show_alert_modal
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-listing',
      user,
      id: listing.id
    })
    controller.addToAlreadyViewed(listing.id)
  },
  addToAlreadyViewed(id) {
    const data = AppStore.data
    const listing_map = data.listing_map
    if (!listing_map)
      return
    if (listing_map.listings_viewed) {
      if (listing_map.listings_viewed.indexOf(id) === -1)
        AppStore.data.listing_map.listings_viewed.push(id)
    }
    else
      AppStore.data.listing_map.listings_viewed = [id]
    AppStore.emitChange()
  },
  hideListingViewer() {
    delete AppStore.data.show_listing_viewer
    delete AppStore.data.current_listing
    if (!AppStore.data.show_search_map || !AppStore.data.show_alerts_map || !AppStore.data.show_actives_map)
      AppStore.data.show_search_map = true
    const history = require('../../../../utils/history')
    history.pushState(null, '/dashboard/mls')
    AppStore.emitChange()
  },
  showModalGallery(image_url) {
    if (!image_url)
      return
    const data = AppStore.data
    const gallery_image_urls = data.current_listing.gallery_image_urls
    const image_index = gallery_image_urls.indexOf(image_url)
    AppStore.data.show_modal_gallery = true
    AppStore.data.modal_gallery = {
      current_index: image_index,
      gallery_image_urls
    }
    AppStore.emitChange()
  },
  handleModalGalleryNav(selectedIndex, selectedDirection) {
    const data = AppStore.data
    const gallery_image_urls = data.current_listing.gallery_image_urls
    const current_index = AppStore.data.modal_gallery.current_index
    if (selectedDirection === 'prev')
      AppStore.data.modal_gallery.current_index = current_index - 1
    if (selectedDirection === 'next')
      AppStore.data.modal_gallery.current_index = current_index + 1
    if (AppStore.data.modal_gallery.current_index === -1)
      AppStore.data.modal_gallery.current_index = gallery_image_urls.length - 1
    if (AppStore.data.modal_gallery.current_index === gallery_image_urls.length)
      AppStore.data.modal_gallery.current_index = 0
    AppStore.data.modal_gallery.direction = selectedDirection
    AppStore.emitChange()
  },
  showShareListingModal() {
    AppStore.data.show_share_listing_modal = true
    AppStore.data.share_modal = {}
    AppStore.emitChange()
  },
  hideShareListingModal() {
    delete AppStore.data.show_share_listing_modal
    AppStore.emitChange()
  }
}
export default controller