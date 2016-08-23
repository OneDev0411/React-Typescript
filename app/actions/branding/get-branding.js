// actions/branding/get-branding.js
import Brand from '../../models/Brand'
import AppStore from '../../stores/AppStore'
import ListingDispatcher from '../../dispatcher/ListingDispatcher'
export default (subdomain) => {
  const params = {
    subdomain
  }
  Brand.getBySubdomain(params, (err, res) => {
    if (res.status === 'success') {
      AppStore.data.brand = {
        id: res.data.id,
        title: res.data.title,
        logo_url: res.data.logo_url,
        primary: res.data.palette.primary_color.replace('#', ''),
        map_url: res.data.map_url,
        subdomain,
        logo_url_wide: res.data.logo_url_wide,
        office_mls_id: res.data.office_mls_id,
        default_avatar: res.data.default_avatar,
        listing_url: res.data.listing_url
      }
      if (AppStore.data.listing_map) {
        setTimeout(() => {
          ListingDispatcher.dispatch({
            action: 'get-valerts',
            user: AppStore.data.user,
            options: AppStore.data.listing_map.options
          })
        }, 500)
      }
      AppStore.emitChange()
    }
  })
}