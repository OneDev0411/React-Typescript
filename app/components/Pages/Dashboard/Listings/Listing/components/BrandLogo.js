import S from 'shorti'
import React from 'react'
import Brand from '../../../../../../controllers/Brand'

const BrandLogo = ({
  data
}) => {
  let logo = <div />

  if (!data.user &&
    !data.is_widget &&
    Brand.asset('site_logo_wide')
  ) {
    const host = `https://${window.location.host}`
    brand_logo = (
      <div style={S('pull-left z-3 absolute p-16')}>
        <a href={host}>
          <img
            style={S('maxw-200 maxh-40')}
            src={Brand.asset('site_logo_wide')}
          />
        </a>
      </div>
    )
  }

  return logo
}

export default BrandLogo