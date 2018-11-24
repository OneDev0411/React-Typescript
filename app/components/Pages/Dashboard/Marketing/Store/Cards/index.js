import React from 'react'
import pure from 'recompose/pure'
import styled from 'styled-components'

import { getMQWidth } from './helpers'
import Video from './Video'
import SocialListings from './SocialListings'
import EmailListings from './EmailListings'

const SecondRow = styled.div`
  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    display: flex;
  }
`

function Cards({ isSideMenuOpen }) {
  return (
    <div>
      <Video />
      <SecondRow isSideMenuOpen={isSideMenuOpen}>
        <SocialListings isSideMenuOpen={isSideMenuOpen} />
        <EmailListings isSideMenuOpen={isSideMenuOpen} />
      </SecondRow>
    </div>
  )
}

export default pure(Cards)
