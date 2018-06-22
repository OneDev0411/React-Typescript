import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  z-index: 10;
  margin: 0 auto;

  i {
    color: #2196f3;
  }

  ${props =>
    props.absolute === true &&
    `
    position: absolute;
    top: 50px;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.5);
    padding: 30px;
    i {
      font-size: 60px;
    }
  `};
`

const Fetching = ({ show, absolute }) => {
  if (!show) {
    return false
  }

  return (
    <Container absolute={absolute}>
      <i className="fa fa-spin fa-spinner fa-3x" />
    </Container>
  )
}

export default Fetching
