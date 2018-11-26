import React from 'react'
import pure from 'recompose/pure'
import styled from 'styled-components'

const Text = styled.div`
  padding: 0.25em 0.5em;
  color: #fff;
  border-radius: 3px;
  background: #000;
`

function ComingSoon() {
  return <Text>Coming Soon!</Text>
}

export default pure(ComingSoon)
