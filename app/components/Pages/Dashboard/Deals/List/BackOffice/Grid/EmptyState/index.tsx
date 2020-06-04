import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`

const Title = styled.div`
  font-size: 26px;
  font-weight: 600;
  font-weight: bold;
  color: #62778c;
  margin: 30px 0 10px 0;
`

const Description = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #8da2b5;
  margin-bottom: 20px;
`

export default () => (
  <Container>
    <img src="/static/images/deals/coffee-icon.svg" alt="" />

    <Title>You’ve done it. Inbox zero.</Title>
    <Description>
      Sit back and relax. Get a coffee. We’ll notify you when a deal needs your
      attention.
    </Description>
  </Container>
)
