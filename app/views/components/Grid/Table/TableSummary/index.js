import React from 'react'
import styled from 'styled-components'

const Container = styled.div``

const Title = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
`

function parseText({ text, ...parameters }) {
  if (!text) {
    return ''
  }

  let compiledText = text
  const matches = text.match(/\[(.*?)\]/gi)

  matches.forEach(variable => {
    const variableName = variable.replace('[', '').replace(']', '')

    compiledText = compiledText.replace(
      variable,
      parameters[variableName] || ''
    )
  })

  return compiledText
}

export const TableSummary = props => {
  if (typeof props.text === 'function') {
    return props.text()
  }

  return (
    <Container>
      <Title dangerouslySetInnerHTML={{ __html: parseText(props) }} />
    </Container>
  )
}
