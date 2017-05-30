import React, { Component } from 'react'
import ListingDispatcher from '../../../../../dispatcher/ListingDispatcher'
import ContactModel from '../../../../../models/Contact'
import controller from '../../controller'
import Brand from '../../../../../controllers/Brand'
import S from 'shorti'
import ListingViewer from '../../Partials/ListingViewer'
import ListingViewerMobile from '../../Partials/ListingViewerMobile'
export default class Listing extends Component {
  componentWillMount() {
    const data = this.props.data
    const user = data.user
    if (this.props.params && this.props.params.id) {
      ListingDispatcher.dispatch({
        action: 'get-listing',
        user,
        id: this.props.params.id
      })
    }
  }

  componentDidMount() {
    const { data } = this.props
    if (data.user) {
      this.updateUserTimeline()
    }
  }

  updateUserTimeline() {
    const { data, params } = this.props
    ContactModel.updateUserTimeline(data.user, 'UserViewedListing', 'Listing', params.id)
  }

  render() {
    const { data } = this.props
    const user = data.user
    let listing_viewer
    if (data.show_listing_viewer) {
      listing_viewer = (
        <ListingViewer
          data={data}
          listing={data.current_listing}
          hideModal={controller.listing_map.hideModal}
          hideListingViewer={controller.listing_viewer.hideListingViewer.bind(this)}
          showModalGallery={controller.listing_viewer.showModalGallery}
          handleModalGalleryNav={controller.listing_viewer.handleModalGalleryNav}
          showShareListingModal={controller.listing_viewer.showShareListingModal}
        />
      )
      // Check for mobile
      if (data.is_mobile) {
        listing_viewer = (
          <ListingViewerMobile
            data={data}
            listing={data.current_listing}
            hideModal={controller.listing_map.hideModal}
            hideListingViewer={controller.listing_viewer.hideListingViewer}
            showModalGallery={controller.listing_viewer.showModalGallery}
            handleModalGalleryNav={controller.listing_viewer.handleModalGalleryNav}
            showShareListingModal={controller.listing_viewer.showShareListingModal}
          />
        )
      }
    }
    let brand_logo
    if (!data.is_widget && !data.user && Brand.asset('site_logo_wide')) {
      const host = `https://${window.location.host}`
      brand_logo = (
        <div style={S('pull-left z-3 absolute p-16')}>
          <a href={host}>
            <img style={S('maxw-200 maxh-40')} src={Brand.asset('site_logo_wide')} />
          </a>
        </div>
      )
    }
    return (
      <main>
        { brand_logo }
        { listing_viewer }
      </main>
    )
  }
}
Listing.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object
}
