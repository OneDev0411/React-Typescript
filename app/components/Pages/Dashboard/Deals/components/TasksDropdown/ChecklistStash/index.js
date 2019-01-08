import React from 'react'

import { primary } from 'views/utils/colors'

import { ChecklistItemContainer, ChecklistItemTitle } from '../styled'

export const ChecklistStash = ({ onSelect, stashOptionText, selectedTask }) => (
  <ChecklistItemContainer onClick={onSelect}>
    <ChecklistItemTitle color={primary} bold={selectedTask === null}>
      {stashOptionText || 'Upload directly to my Files'}
    </ChecklistItemTitle>
  </ChecklistItemContainer>
)
