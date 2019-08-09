import React from 'react'

import IconTaskCritical from 'components/SvgIcons/TaskCritical/IconTaskCritical'
import { grey } from 'views/utils/colors'

import { Container, Title } from './styled'

export function EmptyState() {
  return (
    <Container>
      <IconTaskCritical
        fill={grey.A500}
        style={{
          width: '5rem',
          height: '5rem'
        }}
      />
      <Title>There is no event</Title>
    </Container>
  )
}
