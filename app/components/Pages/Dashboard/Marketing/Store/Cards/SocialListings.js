import React from 'react'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'
import Button from 'components/Button/LinkButton'

import { getMQWidth } from './helpers'

const Container = styled.div`
  padding: 2rem 2rem 0 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border-radius: 3px;
  background-color: #f4ead7;

  > img {
    max-width: 100%;
  }

  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    height: 25rem;
    width: calc(62% - 1.5rem);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;

    > img {
      width: ${570 / 16}rem;
      height: ${226 / 16}rem;
    }
  }
`

export default function SocialListings(props) {
  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Jumbo style={{ marginBottom: '1rem' }}>
          Post listings on social media
        </Jumbo>
        <Button
          appearance="outline"
          to="/dashboard/marketing/JustListed/Social"
        >
          Browse Designs
        </Button>
      </div>
      <img
        src="/static/images/marketing/store/cards/social-listings/social-listings.png"
        alt="Post listings on social media"
      />
    </Container>
  )
}
