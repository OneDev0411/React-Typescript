import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  position: relative;
  height: 48px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`

const Title = styled.h3`
  margin: 0;
  font-size: 1.5em;
  line-height: 1;
  font-weight: 500;
  color: #26465e;
`

const propTypes = {
  title: PropTypes.string
}

function Header(props) {
  return (
    <Container>
      <Title>{props.title}</Title>
      {props.children}
    </Container>
  )
}

Header.propTypes = propTypes

export default Header
