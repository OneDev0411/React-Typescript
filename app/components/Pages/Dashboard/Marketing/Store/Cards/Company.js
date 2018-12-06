import React from 'react'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'

import { getMQWidth } from './helpers'
import ComingSoon from './components/ComingSoonBadge'

const Container = styled.div`
  height: 25rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border-radius: 3px;
  background: #d1e6d9
    url('/static/images/marketing/store/cards/company/company.png') no-repeat
    bottom left;

  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    width: 38%;
    margin-right: 1.5rem;
  }
`

export default function Company(props) {
  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <Jumbo style={{ marginBottom: '1rem' }}>Your Company</Jumbo>
      <ComingSoon />
    </Container>
  )
}
