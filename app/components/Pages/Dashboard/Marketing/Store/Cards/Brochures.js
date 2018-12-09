import React from 'react'
import styled, { css } from 'styled-components'

import { Jumbo } from 'components/Typography/headings'

import { getMQWidth } from './helpers'
import ComingSoon from './components/ComingSoonBadge'

const absolute_box_style = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const Container = styled.div`
  position: relative;
  height: 25rem;
  margin-bottom: 1.5rem;
  border-radius: 3px;
  background: #dde5d7
    url('/static/images/marketing/store/cards/brochures-and-post-cards/rechat-book-tour-sheet@2x.png')
    no-repeat bottom right;
  background-size: cover;

  &:before {
    content: '';
    ${absolute_box_style};
    background-color: rgba(0, 0, 0, 0.25);
  }

  .jumbo {
    color: #fff;
  }

  @media screen and (min-width: ${props => getMQWidth(85, props)}) {
    &:before {
      background-color: transparent;
    }

    .jumbo {
      color: #000;
    }
  }
`

const AbsoluteBox = styled.div`
  ${absolute_box_style};
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-direction: column;
`

export default function Brochures() {
  return (
    <Container>
      <AbsoluteBox>
        <Jumbo className="jumbo" style={{ marginBottom: '1rem' }}>
          Brochures
          <br />& Post Cards
        </Jumbo>
        <ComingSoon />
      </AbsoluteBox>
    </Container>
  )
}
