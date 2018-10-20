import React from 'react'
import styled from 'styled-components'

export const Label = styled.div`
  font-size: 1.25em;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 0.5rem;
`
export function Section(props) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <Label>{props.label}</Label>
      {props.children}
    </div>
  )
}
