import React from 'react'
import pure from 'recompose/pure'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'
import Button from 'components/Button/LinkButton'

const Container = styled.div`
  padding: 1.5rem;
  margin-bottom: 1.4rem;
  text-align: center;
  color: #fff;
  border-radius: 3px;
  background-color: #002344;

  > img {
    width: ${415 / 16}rem;
    height: ${266 / 16}rem;
    margin-bottom: 1.5rem;
  }

  @media screen and (min-width: 80em) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row-reverse;
    padding: 4.5rem;
  }
`

function Video() {
  return (
    <Container>
      <img
        src="/static/images/marketing/store/cards/video/video.png"
        alt="video"
      />
      <div>
        <Jumbo style={{ color: '#fff', marginBottom: '1rem' }}>
          Create Engaging Videos
        </Jumbo>
        <p style={{ marginBottom: '1.5rem' }}>
          Showcase your listings with video on Instagram and Facebook.
        </p>
        <Button appearance="primary" to="/dashboard/marketing/Social">
          Browse Designs
        </Button>
      </div>
    </Container>
  )
}

export default pure(Video)
