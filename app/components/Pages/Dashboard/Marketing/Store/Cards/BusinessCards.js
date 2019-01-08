import React from 'react'
import styled, { css } from 'styled-components'
import Flex from 'styled-flex-component'

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
  background: url('/static/images/marketing/store/cards/buisness-cards/buisness-cards@2x.jpg')
    no-repeat;
  background-size: cover;

  @media (min-width: ${props => getMQWidth(75, props)}) {
    width: 38%;
    margin-right: 1.5rem;
  }

  &:before {
    content: '';
    ${absolute_box_style};
    background-color: rgba(0, 0, 0, 0.25);
  }
`

const AbsoluteBox = styled(Flex)`
  ${absolute_box_style};
  padding: 2rem;
`

export default function BusinessCards(props) {
  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <AbsoluteBox center column>
        <Jumbo style={{ marginBottom: '1rem', color: '#fff' }}>
          Business Cards
        </Jumbo>
        <ComingSoon />
      </AbsoluteBox>
    </Container>
  )
}
