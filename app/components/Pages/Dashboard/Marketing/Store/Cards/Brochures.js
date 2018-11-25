import React from 'react'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'

import { getMQWidth } from './helpers'
import ComingSoon from './components/ComingSoonBadge'

const Container = styled.div`
  padding: 2rem;
  height: 25rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-direction: column;
  margin-bottom: 1.5rem;
  border-radius: 3px;
  background: #dde5d7
    url('/static/images/marketing/store/cards/brochures-and-post-cards/rechat-book-tour-sheet.png')
    no-repeat bottom right;

  .jumbo {
    color: #fff;

    @media screen and (min-width: ${props => getMQWidth(85, props)}) {
      color: #000;
    }
  }
`

export default function Brochures() {
  return (
    <Container>
      <Jumbo className="jumbo" style={{ marginBottom: '1rem' }}>
        Brochures
        <br />& Post Cards
      </Jumbo>
      <ComingSoon />
    </Container>
  )
}
