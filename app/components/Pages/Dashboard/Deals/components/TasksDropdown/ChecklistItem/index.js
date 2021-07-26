import React from 'react'

import cn from 'classnames'

import { NotifyOffice } from '../NotifyOffice'
import {
  ChecklistItemContainer,
  ChecklistItemTitle,
  ChecklistItemNotifyOffice
} from '../styled'

export const ChecklistItem = ({
  id,
  title,
  checklist,
  selectedItem,
  onSelect,
  showNotifyOption,
  shouldNotifyOffice,
  onChangeNotifyOffice
}) => (
  <ChecklistItemContainer
    onClick={e => e.stopPropagation()}
    className={cn({
      selected: selectedItem === id
    })}
  >
    <ChecklistItemTitle
      fullWidth={!showNotifyOption || selectedItem === id}
      onClick={() => onSelect(id)}
    >
      {title}
    </ChecklistItemTitle>

    {showNotifyOption && selectedItem !== id && (
      <ChecklistItemNotifyOffice>
        <NotifyOffice
          id={id}
          checklist={checklist}
          isSelected={shouldNotifyOffice}
          onChange={onChangeNotifyOffice}
        />
      </ChecklistItemNotifyOffice>
    )}
  </ChecklistItemContainer>
)
