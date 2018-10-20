import React from 'react'
import { ChecklistItemContainer, ChecklistItemTitle } from '../../styled'
import { primary } from 'views/utils/colors'

export const CreateTaskItem = ({ checklist, onSelect }) => (
  <ChecklistItemContainer
    onClick={e => {
      e.stopPropagation()
      onSelect(checklist.id)
    }}
  >
    <ChecklistItemTitle color={primary} bold>
      Add new task to {checklist.title}
    </ChecklistItemTitle>
  </ChecklistItemContainer>
)
