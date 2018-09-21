import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border: 2px solid ${props => props.color};
  width: 100%;
  height: 100%;
`

export default Container