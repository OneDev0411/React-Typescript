import React from 'react'
import Brand from '../../../../../../controllers/Brand'

const BrandLogo = ({ data, isWidget, title = 'Rechat', styles }) => {
  if (data.user && !isWidget) {
    return <div />
  }

  title =
    data.brand_queried && data.brand_checked && data.brand
      ? data.brand.messages.site_title
      : title

  const image = Brand.asset('site_logo_wide')

  const defaultStyle = {
    position: 'absolute',
    float: 'left',
    zIndex: 3,
    padding: '16px'
  }

  return (
    <div style={{ ...defaultStyle, ...styles }}>
      <a
        href={`https://${window.location.host}`}
        style={
          image
            ? {}
            : {
              fontSize: '2.5rem',
              fontWieght: 'bold',
              paddingTop: '1rem',
              color: `#${Brand.color('primary', '3388ff')}`
            }
        }
      >
        {image
          ? <img style={{ maxWidth: '200px', maxHeight: '40px' }} src={image} />
          : title}
      </a>
    </div>
  )
}

export default BrandLogo
