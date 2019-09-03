import React from 'react'
import { Tooltip } from '@material-ui/core'

import { Container, Title } from '../Item/ViewMode/styled'

export default function DefaultTag({ tag }) {
  return (
    <Tooltip title="You cannot edit a default tag.">
      <Container
        highlight={tag.highlight}
        data-test={`tag-item-${tag.text}`}
        style={{ margin: '0 0.3rem' }}
      >
        <Title
          style={{
            margin: 0,
            width: '100%',
            padding: '0 0.5em',
            textAlign: 'center'
          }}
        >
          {tag.text}
        </Title>
      </Container>
    </Tooltip>
  )
}
