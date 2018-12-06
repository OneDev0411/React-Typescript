import React from 'react'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'
import Button from 'components/Button/LinkButton'

import { getMQWidth } from './helpers'

const Container = styled.div`
  padding: 2rem;
  height: 25rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 1.5rem;
  text-align: center;
  border-radius: 3px;
  background: #efe9ea
    url('/static/images/marketing/store/cards/holiday/holiday@3x.png') no-repeat;
  background-size: cover;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    padding-left: 3rem;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
`

export default function Instagram(props) {
  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <ContentWrapper>
        <Jumbo style={{ marginBottom: '1rem' }}>’Tis the season</Jumbo>
        <p style={{ marginBottom: '1.5rem' }}>
          Choose the perfect design to compliment all your featured listings.
        </p>
        <Button appearance="primary" to="/dashboard/marketing/NewYear">
          Browse Designs
        </Button>
      </ContentWrapper>
    </Container>
  )
}
