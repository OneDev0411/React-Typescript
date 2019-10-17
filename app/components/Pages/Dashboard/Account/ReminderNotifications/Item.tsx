import React, { useState, useEffect } from 'react'

import { BasicDropdown } from 'components/BasicDropdown'
import { DropdownItem } from 'components/Dropdown/types'
import { CheckBoxButton } from 'components/Button/CheckboxButton'
import IconBell from 'components/SvgIcons/Bell/IconBell'

import CustomValue from './CustomValue'
import { Container, CheckBoxContainer, DropButton, IconDrop } from './styled'

const CUSTOM_VALUE: DropdownItem = {
  label: 'Custom',
  value: 'CUSTOM'
}

interface Props {
  type: string
  name: string
  value: number
  label: string
  options: DropdownItem[]
  onChange: (change: {
    type: 'add' | 'remove'
    setting: {
      object_type: string
      event_type: string
      reminder: number
    }
  }) => unknown
}

export default function Item(props: Props) {
  const findOptionByValue = (options: DropdownItem[], value: any) => {
    return options.find(item => item.value === value)
  }

  const [showCustomValueInput, setShowCustomValueInput] = useState(false)

  useEffect(() => {
    if (
      props.value !== undefined &&
      findOptionByValue(props.options, props.value) === undefined
    ) {
      setShowCustomValueInput(true)

      return
    }

    setShowCustomValueInput(false)
  }, [props.options, props.value])

  const handleChange = (value: number, type: 'add' | 'remove' = 'add') => {
    props.onChange({
      type,
      setting: {
        object_type: props.type,
        event_type: props.name,
        reminder: value
      }
    })
  }

  const checkboxChangeHandler = () => {
    const changeType = props.value >= 0 ? 'remove' : 'add'
    const value = props.value || props.options[0].value

    handleChange(value, changeType)
  }

  const dropdownChangeHandler = ({ value }) => {
    if (value === CUSTOM_VALUE.value) {
      setShowCustomValueInput(true)

      return
    }

    setShowCustomValueInput(false)
    handleChange(value)
  }

  const { label, value, options } = props
  const selectedItem = showCustomValueInput
    ? CUSTOM_VALUE
    : findOptionByValue(options, value) || options[0]

  return (
    <Container>
      <CheckBoxContainer onClick={checkboxChangeHandler}>
        <CheckBoxButton
          onClick={checkboxChangeHandler}
          isSelected={props.value != null}
          square
        />
        &nbsp;&nbsp;<span>{label}</span>
      </CheckBoxContainer>

      <BasicDropdown
        disabled={props.value == null}
        fullHeight
        items={[...options, CUSTOM_VALUE]}
        selectedItem={selectedItem}
        buttonIcon={IconBell}
        onSelect={dropdownChangeHandler}
        menuStyle={{
          width: '11rem'
        }}
        buttonRenderer={props => (
          <DropButton
            {...props}
            inverse
            style={{ paddingLeft: 0, width: '11rem' }}
          >
            <IconBell />
            {selectedItem.label}
            <IconDrop
              isOpen={props.isOpen}
              style={{ margin: '0.25rem 0 0 0.25rem' }}
            />
          </DropButton>
        )}
      />
      {showCustomValueInput && (
        <CustomValue value={props.value} onChange={handleChange} />
      )}
    </Container>
  )
}
