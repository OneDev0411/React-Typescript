import React from 'react'
import pure from 'recompose/pure'
import styled from 'styled-components'

import { getMQWidth } from './helpers'
import SocialListings from './SocialListings'
import EmailListings from './EmailListings'
import Brand from './Brand'
import Instagram from './Instagram'
import FacebookCovers from './FacebookCovers'
import AsSeenIn from './AsSeenIn'
import BusinessCards from './BusinessCards'
import Birthday from './Birthday'
import Brochures from './Brochures'

const ResponsiveRow = styled.div`
  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    display: flex;
  }
`

function Cards({ isSideMenuOpen }) {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <ResponsiveRow isSideMenuOpen={isSideMenuOpen}>
        <SocialListings isSideMenuOpen={isSideMenuOpen} />
        <EmailListings isSideMenuOpen={isSideMenuOpen} />
      </ResponsiveRow>
      <ResponsiveRow isSideMenuOpen={isSideMenuOpen}>
        <Brand isSideMenuOpen={isSideMenuOpen} />
        <Instagram isSideMenuOpen={isSideMenuOpen} />
      </ResponsiveRow>
      <ResponsiveRow isSideMenuOpen={isSideMenuOpen}>
        <FacebookCovers isSideMenuOpen={isSideMenuOpen} />
        <AsSeenIn isSideMenuOpen={isSideMenuOpen} />
      </ResponsiveRow>
      <ResponsiveRow isSideMenuOpen={isSideMenuOpen}>
        <BusinessCards isSideMenuOpen={isSideMenuOpen} />
        <Birthday isSideMenuOpen={isSideMenuOpen} />
      </ResponsiveRow>
      <Brochures isSideMenuOpen={isSideMenuOpen} />
    </div>
  )
}

export default pure(Cards)
