import React from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { Jumbo } from 'components/Typography/headings'

import { getMQWidth } from './helpers'
import ComingSoon from './components/ComingSoonBadge'

const Container = styled(Flex)`
  height: 25rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border-radius: 3px;
  background: url('/static/images/marketing/store/cards/buisness-cards/buisness-cards.jpg')
    no-repeat;
  background-size: cover;

  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    height: 25rem;
    width: 25rem;
    margin-right: 1.5rem;
  }
`

export default function BusinessCards(props) {
  return (
    <Container center column isSideMenuOpen={props.isSideMenuOpen}>
      <Jumbo style={{ marginBottom: '1rem', color: '#fff' }}>
        Business Cards
      </Jumbo>
      <ComingSoon />
    </Container>
  )
}
