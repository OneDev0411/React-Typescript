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
  background: url('/static/images/marketing/store/cards/brand-campaign/brand-campaign@2x.png')
    no-repeat;
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
  const color = '#fff'

  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <ContentWrapper>
        <Jumbo style={{ marginBottom: '0.5rem', color }}>
          Extraordinary begins at home.
        </Jumbo>
        <p
          style={{
            color,
            fontSize: '1.5rem',
            marginBottom: '1em'
          }}
        >
          Promote the power of the Sotheby’s brand to clients.
        </p>
        <Button appearance="primary" to="/dashboard/marketing/Brand">
          Browse Designs
        </Button>
      </ContentWrapper>
    </Container>
  )
}
