import React from 'react'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'
import Button from 'components/Button/LinkButton'

import { getMQWidth } from './helpers'

const Container = styled.div`
  padding: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #fff;
  border-radius: 3px;
  background-color: #002344;

  > img {
    max-width: 100%;
    margin-top: 2rem;
  }

  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    height: 25rem;
    display: flex;
    align-items: center;
    text-align: left;
    justify-content: space-between;
    padding: 0 4.5rem;

    > img {
      width: ${415 / 16}rem;
      height: ${266 / 16}rem;
      margin: 0;
    }
  }
`

export default function Video(props) {
  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <div>
        <Jumbo style={{ color: '#fff', marginBottom: '1rem' }}>
          Create Engaging Videos
        </Jumbo>
        <p style={{ marginBottom: '1.5rem' }}>
          Showcase your listings with video on Instagram and Facebook.
        </p>
        <Button
          appearance="primary"
          to="/dashboard/marketing/JustListed/Social"
        >
          Browse Designs
        </Button>
      </div>
      <img
        src="/static/images/marketing/store/cards/video/video.png"
        alt="video"
      />
    </Container>
  )
}
