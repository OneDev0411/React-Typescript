import React from 'react'
import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'
import Button from 'components/Button/LinkButton'

import { getMQWidth } from './helpers'

const Container = styled.div`
  padding: 2rem 2rem 0 2rem;
  height: 25rem;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  margin-bottom: 1.5rem;
  text-align: center;
  border-radius: 3px;
  background: #ebeef1
    url('/static/images/marketing/store/cards/birthday/birthday.png') no-repeat;
  background-position-x: 2rem;
  background-position-y: 100%;

  @media screen and (min-width: ${props => getMQWidth(75, props)}) {
    width: calc(62% - 1.5rem);

    .cta-wrapper {
      text-align: center;
      width: 20rem;
    }
  }
`

export default function Instagram(props) {
  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      <Jumbo style={{ marginBottom: '1rem' }}>Birthday Emails</Jumbo>
      <div className="cta-wrapper">
        <Button appearance="outline" to="/dashboard/marketing/Email/Birthday">
          Browse Designs
        </Button>
      </div>
    </Container>
  )
}
