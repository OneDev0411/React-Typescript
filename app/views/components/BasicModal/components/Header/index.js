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

const CloseButton = styled.i`
  float: right;
  cursor: pointer;
  :hover {
    color: red;
  }
`

const propTypes = {
  title: PropTypes.string
}

const Header = ({ title, children, showClose, handleOnClose }) => (
  <Container>
    <Title>{title}</Title>
    {children}

    {showClose && (
      <CloseButton className="fa fa-times" onClick={handleOnClose} />
    )}
  </Container>
)

Header.propTypes = propTypes

export default Header
