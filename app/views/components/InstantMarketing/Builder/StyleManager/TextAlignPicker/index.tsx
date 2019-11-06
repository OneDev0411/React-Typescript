import React, { useState } from 'react'

import { BasicDropdown } from 'components/BasicDropdown'

import { ItemTitle, ItemContainer } from '../styled'

interface DropDownOption {
  label: string
  value: string
}

const OPTIONS: DropDownOption[] = [
  {
    label: 'Left',
    value: 'left'
  },
  {
    label: 'Center',
    value: 'center'
  },
  {
    label: 'Right',
    value: 'right'
  }
]

const findSelectedItemByValue = value =>
  OPTIONS.find(item => item.value === value) || OPTIONS[0]

interface Props {
  title?: string
  value?: string
  onChange: (value: string) => void
}

export default function FontSizePicker({
  title = 'Text Align',
  value = 'right',
  onChange
}: Props) {
  const [innerValue, setInnerValue] = useState<string | undefined>(value)

  function handleChange({ value: itemValue }) {
    setInnerValue(itemValue)
    onChange(itemValue)
  }

  return (
    <ItemContainer>
      <ItemTitle>{title}</ItemTitle>
      <BasicDropdown
        menuStyle={{ width: '100%', fontSize: '1rem' }}
        style={{ width: '100%' }}
        selectedItem={findSelectedItemByValue(innerValue)}
        items={OPTIONS}
        onSelect={handleChange}
        centerSelected
      />
    </ItemContainer>
  )
}
