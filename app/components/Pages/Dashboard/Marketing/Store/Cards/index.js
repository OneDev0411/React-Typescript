import React from 'react'
import pure from 'recompose/pure'
import styled from 'styled-components'

import { getMQWidth } from './helpers'
import Video from './Video'
import SocialListings from './SocialListings'
import EmailListings from './EmailListings'
import Company from './Company'
import Instagram from './Instagram'
import FacebookCovers from './FacebookCovers'

const ResponsiveRow = styled.div`
  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    display: flex;
  }
`

function Cards({ isSideMenuOpen }) {
  return (
    <React.Fragment>
      <Video isSideMenuOpen={isSideMenuOpen} />
      <ResponsiveRow isSideMenuOpen={isSideMenuOpen}>
        <SocialListings isSideMenuOpen={isSideMenuOpen} />
        <EmailListings isSideMenuOpen={isSideMenuOpen} />
      </ResponsiveRow>
      <ResponsiveRow isSideMenuOpen={isSideMenuOpen}>
        <Company isSideMenuOpen={isSideMenuOpen} />
        <Instagram isSideMenuOpen={isSideMenuOpen} />
      </ResponsiveRow>
      <ResponsiveRow isSideMenuOpen={isSideMenuOpen}>
        <FacebookCovers isSideMenuOpen={isSideMenuOpen} />
      </ResponsiveRow>
    </React.Fragment>
  )
}

export default pure(Cards)
