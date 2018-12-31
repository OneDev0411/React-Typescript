import React from 'react'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'

import { getMQWidth } from './helpers'
import ComingSoon from './components/ComingSoonBadge'

const Container = styled.div`
  padding: 2rem;
  height: 25rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-direction: column;
  margin-bottom: 1.5rem;
  text-align: center;
  border-radius: 3px;
  background: #ded1e1
    url('/static/images/marketing/store/cards/instagram/instagram@2x.png')
    no-repeat bottom right;
  background-size: 33rem 25rem;

  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    width: calc(62% - 1.5rem);
  }
`

export default function Instagram(props) {
  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <Jumbo style={{ marginBottom: '1rem' }}>Instagram Stories</Jumbo>
      <ComingSoon />
    </Container>
  )
}
