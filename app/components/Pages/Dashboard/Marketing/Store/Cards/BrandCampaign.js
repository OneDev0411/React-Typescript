import React from 'react'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'
import Button from 'components/Button/LinkButton'

import { getMQWidth } from './helpers'

const Container = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  text-align: center;
  border-radius: 3px;
  background: url('/static/images/marketing/store/cards/brand-campaign/brand_campaign_bg@3x.jpg')
    no-repeat;
  background-size: cover;

  @media screen and (min-width: ${props => getMQWidth(85, props)}) {
    height: 25rem;
    padding-right: 5rem;
    flex-direction: row;
    justify-content: space-between;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;

  @media screen and (min-width: ${props => getMQWidth(85, props)}) {
    padding-left: 3rem;
    margin-bottom: 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
`

export default function Instagram(props) {
  const color = '#fff'

  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <ContentWrapper isSideMenuOpen={props.isSideMenuOpen}>
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
      <img
        alt="fg"
        style={{ width: '21.25rem' }}
        src="/static/images/marketing/store/cards/brand-campaign/brand_campaign_fg.png"
      />
    </Container>
  )
}
