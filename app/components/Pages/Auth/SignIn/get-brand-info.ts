import Brand from '../../../../controllers/Brand'

import { primary } from '../../../../views/utils/colors'

export const getBrandInfo = brand => {
  let siteColor = primary
  let siteTitle = 'Rechat'
  let siteLogo = '/static/images/logo.svg'

  if (brand) {
    siteLogo = Brand.asset('site_logo', null, brand)
    siteTitle = Brand.message('office_title', siteTitle, brand)
    siteColor = Brand.color('primary', primary, brand)
  }

  return {
    siteLogo,
    siteTitle,
    siteColor
  }
}
