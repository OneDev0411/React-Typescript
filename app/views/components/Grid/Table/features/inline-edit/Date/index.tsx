import { useState, useEffect } from 'react'

import { TextField } from '@material-ui/core'
import fecha from 'fecha'
import DayPicker, { DayModifiers } from 'react-day-picker'

import 'react-day-picker/lib/style.css'
import { useStyles } from './styles'

interface Props {
  value: Nullable<Date>
  readOnly?: boolean
  dateFormat?: string
  rowSize?: number
}

export function DateInlineEdit({
  value,
  readOnly = false,
  dateFormat = 'MMM D, YYYY',
  rowSize = 40
}: Props) {
  const [inputValue, setInputValue] = useState<string>('')
  const classes = useStyles({ rowSize })

  const parse = (input: string): Nullable<Date> => {
    const parsed = fecha.parse(input, dateFormat)

    if (typeof parsed === 'boolean') {
      return null
    }

    return parsed
  }

  const renderDayPicker = () => {
    const parsed = parse(inputValue)

    const getDate = (datetime: Date = new Date()) =>
      new Date(
        datetime.getUTCFullYear(),
        datetime.getUTCMonth(),
        datetime.getUTCDate()
      )

    const getMonth = (datetime: Date = new Date()) =>
      new Date(datetime.getUTCFullYear(), datetime.getUTCMonth())

    const handleDayClick = (day: Date, { selected }: DayModifiers) => {
      if (selected) {
        return
      }

      if (day) {
        setInputValue(fecha.format(day, dateFormat))
      }
    }

    return (
      <DayPicker
        showOutsideDays
        onDayClick={handleDayClick}
        month={parsed ?? getMonth()}
        selectedDays={parsed !== null ? [parsed] : [getDate()]}
      />
    )
  }

  const onChange = e => {
    const input = e.target.value
    const parsed = parse(input)

    if (parsed) {
      setInputValue(fecha.format(parsed, dateFormat))
    } else {
      setInputValue(input)
    }
  }

  useEffect(() => {
    if (value) {
      setInputValue(fecha.format(value, dateFormat))
    }
  }, [value, dateFormat])

  return (
    <div className={classes.root}>
      <div className={classes.inputContainer}>
        <TextField
          value={inputValue}
          size="small"
          disabled={readOnly}
          fullWidth
          onChange={onChange}
          style={{
            flexDirection: 'row',
            height: '100%'
          }}
          InputProps={{
            disableUnderline: true,
            className: classes.textField
          }}
        />
      </div>
      <div className={classes.pickerContainer}>
        {renderDayPicker()}
        <div className={classes.footerContainer}>
          <a className={classes.footerAction}>Clear</a>
        </div>
      </div>
    </div>
  )
}
