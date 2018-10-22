import React from 'react'
import styled from 'styled-components'

import { H4 } from 'components/Typography/headings'

const Container = styled(H4)`
  color: #7f7f7f;
  font-weight: 500;
  font-size: 0.875rem;

  /* &.BACKUP,
  &.PRIMARY {
    color: #8da2b5;
  }

  &.TERMINATED {
    color: #d0011b;
  } */
`

export function ChecklistLabels(props) {
  const labels = []
  const { checklist } = props

  if (checklist.is_deactivated === true) {
    labels.push('Backup')
  }

  if (
    checklist.checklist_type === 'Buying' &&
    checklist.is_deactivated === false
  ) {
    labels.push('Primary')
  }

  if (checklist.is_terminated) {
    labels.push('Terminated')
  }

  return <Container>{labels.join(' - ')}</Container>
}
