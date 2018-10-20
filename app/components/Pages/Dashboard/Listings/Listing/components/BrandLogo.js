import React from 'react'
import { connect } from 'react-redux'
import Brand from '../../../../../../controllers/Brand'

const BrandLogo = ({ brand, user, isWidget, title = 'Rechat', styles }) => {
  if (user && !isWidget) {
    return <div />
  }

  if (brand) {
    title = Brand.message('site_title', 'Rechat', brand)
  }

  const image = Brand.asset('site_logo_wide')

  const defaultStyle = {
    position: 'absolute',
    top: '0.5em',
    left: '1em',
    zIndex: 3
  }

  return (
    <div style={{ ...defaultStyle, ...styles }}>
      <a
        href={`https://${window.location.host}`}
        style={
          image
            ? {}
            : {
                fontSize: '1.5rem',
                fontWieght: 'bold',
                textDecoration: 'none',
                color: `#${Brand.color('primary', '3388ff')}`
              }
        }
      >
        {image ? (
          <img
            style={{ maxWidth: '200px', maxHeight: '40px' }}
            src={image}
            alt="rechat logo"
          />
        ) : (
          title
        )}
      </a>
    </div>
  )
}

export default connect(({ user, brand }) => ({ brand, user }))(BrandLogo)
