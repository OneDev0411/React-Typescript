import React from 'react'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'

import { getMQWidth } from './helpers'
import ComingSoon from './components/ComingSoonBadge'

const Container = styled.div`
  padding: 2rem;
  height: 25rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 1.5rem;
  border-radius: 3px;
  background: #f2f2f2
    url('/static/images/marketing/store/cards/facebook-covers/facebook-covers.png')
    no-repeat bottom center;
  background-size: contain;

  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    width: calc(62% - 1.5rem);
  }
`

export default function FacebookCovers(props) {
  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <Jumbo style={{ marginBottom: '1rem' }}>Facebook Covers</Jumbo>
      <ComingSoon />
    </Container>
  )
}
