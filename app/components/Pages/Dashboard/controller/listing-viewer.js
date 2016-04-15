// controller/listing-viewer.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
const controller = {
  showListingViewer(listing) {
    const history = require('../../../../utils/history')
    history.replaceState(null, '/dashboard/mls/' + listing.id)
    const data = AppStore.data
    const user = data.user
    AppStore.data.show_listing_viewer = true
    AppStore.data.current_listing = listing
    delete AppStore.data.show_alert_viewer
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-listing',
      user,
      id: listing.id
    })
  },
  hideListingViewer() {
    delete AppStore.data.show_listing_viewer
    delete AppStore.data.current_listing
    history.pushState(null, null, '/dashboard/mls')
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