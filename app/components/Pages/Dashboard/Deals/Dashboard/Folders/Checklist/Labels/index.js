import React from 'react'
import styled, { css } from 'styled-components'

import { H4 } from 'components/Typography/headings'

const Container = styled(H4)`
  ${({ theme }) => css`
    color: #7f7f7f;
    ${theme.typography.body1};
  `}
`

export function ChecklistLabels(props) {
  const { checklist } = props

  if (!checklist) {
    return null
  }

  const labels = []

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
