import React from 'react'

import { ChecklistItemContainer, ChecklistItemTitle } from '../../styled'

export const CreateTaskItem = ({ checklist, onSelect }) => (
  <ChecklistItemContainer
    onClick={e => {
      e.stopPropagation()
      onSelect(checklist.id)
    }}
  >
    <ChecklistItemTitle selected bold>
      Add new task to {checklist.title}
    </ChecklistItemTitle>
  </ChecklistItemContainer>
)
