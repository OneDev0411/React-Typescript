import React, { ReactNode, useState } from 'react'

import { Item } from 'components/Dropdown/Item'
import { BasicDropdown } from 'components/BasicDropdown'
import { Checkbox } from 'components/Checkbox'
import { DropdownItem } from 'components/Dropdown/types'

interface Props {
  selectedItems: DropdownItem[]
  onChange: (selectedItems: DropdownItem[]) => any
  applyChangesOnClose?: boolean
  /**
   * something to be shown when nothing is selected
   */
  placeholder?: ReactNode
  [key: string]: any /* TODO: migrate basicDropdown to ts and use appropriate type */
}

export function BasicMultiSelectDropdown({
  selectedItems = [],
  onChange = () => {},
  placeholder = '',
  applyChangesOnClose = false,
  ...basicDropdownProps
}: Props) {
  const [pendingSelectedItems, setPendingSelectedItems] = useState(
    selectedItems
  )

  const currentSelectedItems = applyChangesOnClose
    ? pendingSelectedItems
    : selectedItems

  const isSelected = item =>
    currentSelectedItems.find(
      selectedItem => selectedItem.value === item.value
    ) !== undefined
  const getToggleResult = item =>
    isSelected(item)
      ? currentSelectedItems.filter(
          selectedItem => selectedItem.value !== item.value
        )
      : [...currentSelectedItems, item]

  const onToggle = item => {
    const newSelectedItems = getToggleResult(item)

    if (applyChangesOnClose) {
      setPendingSelectedItems(newSelectedItems)
    } else {
      onChange(newSelectedItems)
    }
  }

  return (
    <BasicDropdown
      onOpen={() => setPendingSelectedItems(selectedItems)}
      onClose={() => applyChangesOnClose && onChange(pendingSelectedItems)}
      buttonText={
        selectedItems.map(item => item.label).join(', ') || placeholder
      }
      itemRenderer={({ item }: { item: DropdownItem }) => {
        const onClick = event => {
          if (!(event.target instanceof HTMLInputElement)) {
            onToggle(item)
          }
        }

        return (
          <Item key={item.value} onClick={onClick}>
            <Checkbox
              id={`dropdown-item${item.value}`}
              checked={isSelected(item)}
            />{' '}
            {item.label}
          </Item>
        )
      }}
      {...basicDropdownProps}
    />
  )
}
