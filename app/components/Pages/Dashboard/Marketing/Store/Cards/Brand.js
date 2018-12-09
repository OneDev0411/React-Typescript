import React from 'react'
import styled from 'styled-components'

import Button from 'components/Button/LinkButton'
import { Jumbo } from 'components/Typography/headings'

import { getMQWidth } from './helpers'

const Container = styled.div`
  height: 25rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border-radius: 3px;
  background: #d1e6d9
    url('/static/images/marketing/store/cards/company/company@2x.png') no-repeat
    bottom left;
  background-size: 25rem 25rem;

  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    width: 38%;
    margin-right: 1.5rem;
  }
`

export default function Brand(props) {
  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <Jumbo style={{ marginBottom: '1rem' }}>Brand Campaigns</Jumbo>
      <Button appearance="outline" to="/dashboard/marketing/Brand">
        Browse Designs
      </Button>
    </Container>
  )
}
