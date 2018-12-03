import React from 'react'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'
import Button from 'components/Button/LinkButton'

import { getMQWidth } from './helpers'

const Container = styled.div`
  padding: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border-radius: 3px;
  background-color: #aebdcb;

  > img {
    max-width: 100%;
  }

  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    width: 38%;
    height: 25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    margin-left: 1.5rem;

    > img {
      width: ${347 / 16}rem;
      height: ${198 / 16}rem;
    }
  }
`

export default function AsSeenIn(props) {
  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <div style={{ marginBottom: '1rem' }}>
        <Jumbo style={{ marginBottom: '1rem' }}>As Seen In</Jumbo>
        <Button appearance="outline" to="/dashboard/marketing/Social/AsSeenIn">
          Browse Designs
        </Button>
      </div>
      <img
        src="/static/images/marketing/store/cards/as-seen-in/as-seen-in.png"
        alt="as seen in listings rechat"
      />
    </Container>
  )
}
