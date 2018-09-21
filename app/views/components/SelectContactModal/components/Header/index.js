import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { H3 } from 'views/components/Typography/headings'

const Container = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1em;
  box-shadow: 0 1px 3px 0 #d4d4d4;
`

const propTypes = {
  title: PropTypes.string
}

function Header(props) {
  return (
    <Container>
      <H3>{props.title}</H3>
      {props.children}
    </Container>
  )
}

Header.propTypes = propTypes

export default Header
