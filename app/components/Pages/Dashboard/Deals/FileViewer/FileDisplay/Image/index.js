import React from 'react'
import styled from 'styled-components'

const Img = styled.img`
  margin: 2rem auto;
  max-width: 95%;
`

export function Image(props) {
  return <Img src={props.file.url} alt={props.file.name} />
}
