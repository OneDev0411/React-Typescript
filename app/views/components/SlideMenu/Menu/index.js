import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  width: ${props => (props.isOpen ? props.width : 0)}px;
  height: 100vh;
  overflow-x: hidden;
  padding: 2.5rem 1em 1em;
  background-color: #f2f2f2;
  transition: width 0.1s linear;
`

const propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  width: PropTypes.number
}

const defaultProps = {
  width: 164
}

export const Menu = props => (
  <Container isOpen={props.isOpen} width={props.width}>
    {props.children}
  </Container>
)

Menu.propTypes = propTypes
Menu.defaultProps = defaultProps
