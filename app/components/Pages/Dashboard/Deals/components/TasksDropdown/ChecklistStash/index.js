import React from 'react'

import { ChecklistItemContainer, ChecklistItemTitle } from '../styled'

export const ChecklistStash = ({ onSelect, stashOptionText, selectedTask }) => (
  <ChecklistItemContainer onClick={onSelect}>
    <ChecklistItemTitle selected bold={selectedTask === null}>
      {stashOptionText || 'Upload directly to my Files'}
    </ChecklistItemTitle>
  </ChecklistItemContainer>
)
