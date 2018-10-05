import React from 'react'
import styled from 'styled-components'

import { H4 } from 'components/Typography/headings'

const Container = styled(H4)`
  color: #7f7f7f;

  /* &.BACKUP,
  &.PRIMARY {
    color: #8da2b5;
  }

  &.TERMINATED {
    color: #d0011b;
  } */
`

export default function ChecklistLabels(props) {
  const labels = []
  const { checklist } = props

  if (checklist.is_deactivated === true) {
    labels.push('BACKUP')
  }

  if (
    checklist.checklist_type === 'Buying' &&
    checklist.is_deactivated === false
  ) {
    labels.push('PRIMARY')
  }

  if (checklist.is_terminated) {
    labels.push('TERMINATED')
  }

  return <Container>{labels.join(' - ')}</Container>
}
