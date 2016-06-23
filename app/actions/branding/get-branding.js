// actions/branding/get-branding.js
import Brand from '../../models/Brand'
import AppStore from '../../stores/AppStore'
export default (subdomain) => {
  const params = {
    subdomain
  }
  Brand.getBySubdomain(params, (err, res) => {
    if (res.status === 'success') {
      AppStore.data.brand = {
        title: res.data.title,
        logo_url: res.data.logo_url,
        primary: res.data.palette.primary_color.replace('#', ''),
        subdomain
      }
      AppStore.emitChange()
    }
  })
}