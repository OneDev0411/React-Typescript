import React from 'react'
import pure from 'recompose/pure'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'
import Button from 'components/Button/LinkButton'

const Container = styled.div`
  position: relative;
  padding: 2rem 2rem 0 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border-radius: 3px;
  background-color: #f4ead7;

  > img {
    max-width: 100%;
  }

  @media screen and (min-width: 80em) {
    height: 25rem;
    width: calc(100% - 26.5rem);
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

function SocialListings() {
  return (
    <Container>
      <div style={{ marginBottom: '2.5rem' }}>
        <Jumbo style={{ marginBottom: '1rem' }}>
          Post listings on social media
        </Jumbo>
        <Button appearance="outline" to="/dashboard/marketing/Social">
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

export default pure(SocialListings)
