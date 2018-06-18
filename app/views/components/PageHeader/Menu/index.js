import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`

function PageMenu({ children }) {
  return (
    <Container>{React.Children.map(children, children => children)}</Container>
  )
}

export default PageMenu
