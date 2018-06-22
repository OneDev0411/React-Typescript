import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  background-color: #f8fafb;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.09);
  width: ${props => (props.isOpen ? props.width : 0)}px;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  max-height: 100vh;
  overflow: auto;
  overflow-x: hidden;
  transition: 0.3s all ease-in;
`

const propTypes = {
  isOpen: PropTypes.bool,
  width: PropTypes.number
}

const defaultProps = {
  isOpen: true,
  width: 180
}

export const Menu = ({ children, isOpen, width }) => (
  <Container isOpen={isOpen} width={width}>
    {children}
  </Container>
)

Menu.propTypes = propTypes
Menu.defaultProps = defaultProps
