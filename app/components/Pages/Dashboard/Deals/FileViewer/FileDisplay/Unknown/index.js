import React from 'react'
import styled from 'styled-components'

import LinkButton from 'components/Button/LinkButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 4rem;
`

const Title = styled.div`
  font-size: 1.5rem;
`

const FileName = styled.p`
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 2rem;
`

export function Unknown(props) {
  return (
    <Container>
      <Title>
        Can not preview <strong>.{props.file.name.split('.').pop()}</strong>
        &nbsp; files
      </Title>

      <FileName>{props.file.name}</FileName>

      <LinkButton
        style={{ margin: '0 auto' }}
        appearance="primary"
        href={props.file.url}
        target="_blank"
      >
        Download
      </LinkButton>
    </Container>
  )
}
