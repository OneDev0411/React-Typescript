import React from 'react'
import cn from 'classnames'
import { NotifyOffice } from '../notify-office'
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
  selectedNotifyOffice,
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

    {showNotifyOption &&
      selectedItem !== id && (
        <ChecklistItemNotifyOffice isSelected={selectedNotifyOffice === id}>
          <NotifyOffice
            id={id}
            checklist={checklist}
            isSelected={selectedNotifyOffice === id}
            onChange={onChangeNotifyOffice}
          />
        </ChecklistItemNotifyOffice>
      )}
  </ChecklistItemContainer>
)
