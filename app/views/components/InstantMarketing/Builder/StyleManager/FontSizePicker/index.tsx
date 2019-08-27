import React, { useState } from 'react'

import uniqBy from 'lodash/uniqBy'

import { BasicDropdown } from 'components/BasicDropdown'

import { ItemTitle, ItemContainer } from '../styled'

interface DropDownOption {
  label: string
  value: string
}

const MAX_VALUE = 100
const MIN_VALUE = 2
const STEP = 2
const DEFAULT_SELECTED_INDEX = 3

function generateFontSizes(
  step: number = STEP,
  min: number = MIN_VALUE,
  max: number = MAX_VALUE
): DropDownOption[] {
  const result: DropDownOption[] = []

  for (let i = min; i <= max; i += step) {
    const label = `${i}`
    const value = `${i}px`

    result.push({ label, value })
  }

  return result
}

const DEFAULT_OPTIONS = generateFontSizes()

interface Props {
  title?: string
  value?: string
  onChange: (value: string) => void
}

export default function FontSizePicker({
  title = 'Font Size',
  value = '8px',
  onChange
}: Props) {
  const [innerValue, setInnerValue] = useState<string | undefined>(value)
  const fontSizeValue = value.replace('px', '')
  const options = uniqBy(
    [
      ...DEFAULT_OPTIONS,
      {
        label: fontSizeValue,
        value
      }
    ].sort((a, b) => Number(a.label) - Number(b.label)),
    'label'
  )

  function findSelectedItemByValue(itemValue?: string) {
    if (!itemValue) {
      return options[DEFAULT_SELECTED_INDEX]
    }

    const selectedOption = options.find(item => item.value === innerValue)

    if (!selectedOption) {
      return options[DEFAULT_SELECTED_INDEX]
    }

    return selectedOption
  }

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
        items={options}
        onSelect={handleChange}
        centerSelected
      />
    </ItemContainer>
  )
}
