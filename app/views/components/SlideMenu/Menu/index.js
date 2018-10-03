import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  width: ${props => (props.isOpen ? props.width : '0')};
  height: 100vh;
  overflow-x: hidden;
  padding: ${props => (props.isOpen ? '2.5rem 1em 1em' : '2.5rem 0 1em')};
  background-color: #f2f2f2;
  transition: width 0.1s linear, padding 0.1s linear 0.05s;
`

const propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  width: PropTypes.any
}

const defaultProps = {
  width: '11em'
}

export const Menu = props => (
  <Container isOpen={props.isOpen} width={props.width}>
    {props.children}
  </Container>
)

Menu.propTypes = propTypes
Menu.defaultProps = defaultProps
