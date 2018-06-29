import React from 'react'
import { browserHistory } from 'react-router'
import styled from 'styled-components'

import ActionButton from '../../../../../../../../views/components/Button/ActionButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`

const Title = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #62778c;
  margin-bottom: 10px;
`

const Description = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #8da2b5;
  margin-bottom: 20px;
`

export default () => (
  <Container>
    <Title>You don’t have any deals yet</Title>
    <Description>
      Get started by creating a new listing or making an offer.
    </Description>

    <div>
      <ActionButton
        onClick={() => browserHistory.push('/dashboard/deals/create')}
      >
        Create New Deal
      </ActionButton>
    </div>
  </Container>
)
