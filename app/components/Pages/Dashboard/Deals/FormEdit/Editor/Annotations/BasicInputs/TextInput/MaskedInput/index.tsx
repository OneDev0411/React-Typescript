import React, { useState } from 'react'

import fecha from 'fecha'

import Masked from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import DatePicker from 'components/DatePicker'
import { ContextInlineEdit } from 'deals/FormEdit/Editor/ContextInlineEdit'

const numberMask = createNumberMask({
  prefix: '',
  includeThousandsSeparator: true,
  allowDecimal: true,
  allowNegative: true,
  allowLeadingZeroes: true
})

interface Bounds {
  top: number
  left: number
  bottom: number
  right: number
}

interface Props {
  id: string
  type: 'Input' | 'Number' | 'Date'
  format?: 'Currency'
  style: React.CSSProperties
  defaultValue: string
  bounds: Bounds
  isMultiLine: boolean
  onChange: (value: string) => void
}

export function MaskedInput({
  id,
  type,
  format,
  style,
  bounds,
  isMultiLine,
  defaultValue,
  onChange
}: Props) {
  const [value, setValue] = useState(defaultValue)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  /**
   * Triggers on input change
   * @param e The Event Type
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value = e.target.value

    setValue(value)
    onChange(value)
  }

  /**
   * Triggers on date change
   * @param date
   */
  const handleChangeDate = (date: Date) => {
    const value = fecha.format(date, format || 'YYYY/MM/DD')

    setValue(value)
    onChange(value)
  }

  /**
   * Returns current date of the value
   */
  const getDate = () => {
    const date = new Date(value)

    if (date.toString() !== 'Invalid Date') {
      return date
    }

    return new Date()
  }

  /**
   * Triggers on input click. Show DatePicker when Input Type is Date
   *
   */
  const handleClick = () => {
    if (type === 'Date') {
      setIsDatePickerOpen(true)
    }
  }

  const sharedProps = {
    id,
    style,
    defaultValue,
    value,
    className: 'input-with-template',
    onChange: handleChange
  }

  if (isMultiLine) {
    return <textarea {...sharedProps} />
  }

  if (type === 'Number' && format === 'Currency') {
    return <Masked {...sharedProps} mask={numberMask} />
  }

  if (type === 'Date') {
    return (
      <>
        <input {...sharedProps} onClick={handleClick} />

        <ContextInlineEdit
          isOpen={isDatePickerOpen}
          width={300}
          bounds={bounds}
          onDismiss={() => setIsDatePickerOpen(false)}
        >
          <DatePicker onChange={handleChangeDate} selectedDate={getDate()} />
        </ContextInlineEdit>
      </>
    )
  }

  return <input {...sharedProps} onClick={handleClick} />
}
