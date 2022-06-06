import { useState, useMemo } from 'react'

import { ListItem, makeStyles } from '@material-ui/core'
import { isLeapYear, getDaysInMonth } from 'date-fns'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import Button from 'components/Button/ActionButton'
import { addZero, months } from 'utils/date-times'

import { Input } from './styled'

const useStyles = makeStyles(
  () => ({
    itemsContainer: {
      maxHeight: '200px',
      overflowY: 'scroll'
    }
  }),
  { name: 'LegacyDateField' }
)

export function DateField(props) {
  const classes = useStyles()
  const [day, setDay] = useState(props.day)
  const [month, setMonth] = useState(props.month)
  const [year, setYear] = useState(props.year)

  const daysItems = useMemo(() => {
    const selectedMonth = month.value ? parseInt(month.value, 10) + 1 : 0
    const selectedYear = year ? parseInt(year, 10) : 1800
    const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth, 0))

    const days = [...Array(daysInMonth).keys()].map(day => day + 1)

    return days.map(day => ({
      label: addZero(day),
      value: day
    }))
  }, [month.value, year])
  const monthsItems = useMemo(
    () =>
      months.map((month, index) => ({
        label: month,
        value: index
      })),
    []
  )

  const onChangeDay = selectedDay => {
    setDay(selectedDay)
    props.onChangeDay(selectedDay)
  }

  const onChangeMonth = selectedMonth => {
    setMonth(selectedMonth)
    props.onChangeMonth(selectedMonth)

    /*
      here we resetting day if the user select the Feb month and the day-input
      is more than 29 because the Feb is 28 days month (29 in leap year) 
    */
    if (selectedMonth.value === 1 && day.value >= 29) {
      // skip the process if year exist and is a leap year and day equal to 29
      if (day.value === 29 && year && isLeapYear(new Date(year))) {
        return
      }

      const alteredDay = { label: '28', value: 28 }

      setDay(alteredDay)
      props.onChangeDay(alteredDay)
    }
  }

  const onChangeYear = event => {
    const { value } = event.target

    if (!value || /^\d+$/.test(value)) {
      if (
        value.length >= 4 &&
        !isLeapYear(new Date(value)) &&
        day.value === 29
      ) {
        const alteredDay = { label: '28', value: 28 }

        setDay(alteredDay)
        props.onChangeDay(alteredDay)
      }

      setYear(value)
      props.onChangeYear(value)
    }
  }

  const renderItems = (items, onChange, close) => {
    return (
      <div className={classes.itemsContainer}>
        {items.map((item, key) => (
          <ListItem
            key={key}
            button
            onClick={e => {
              e.stopPropagation()
              close()
              onChange(item)
            }}
          >
            {item.label}
          </ListItem>
        ))}
      </div>
    )
  }

  return (
    <Flex data-test="date-field">
      <BaseDropdown
        buttonLabel={month.label}
        renderMenu={({ close }) =>
          renderItems(monthsItems, onChangeMonth, close)
        }
      />
      <BaseDropdown
        buttonLabel={day.label}
        DropdownToggleButtonProps={{
          disabled: !(Number.isInteger(month.value) && month.value >= 0)
        }}
        renderMenu={({ close }) => renderItems(daysItems, onChangeDay, close)}
      />

      {props.showYear ? (
        <Input
          type="text"
          autoComplete="disabled"
          placeholder="Year"
          maxLength="4"
          onChange={onChangeYear}
          value={year}
        />
      ) : (
        <Button appearance="link" onClick={props.toggleYearOption}>
          + Add Year
        </Button>
      )}
    </Flex>
  )
}

DateField.propTypes = {
  day: PropTypes.shape(),
  month: PropTypes.shape(),
  year: PropTypes.any,
  onChangeDay: PropTypes.func.isRequired,
  onChangeMonth: PropTypes.func.isRequired,
  onChangeYear: PropTypes.func,
  showYear: PropTypes.bool,
  toggleYearOption: PropTypes.func
}

DateField.defaultProps = {
  showYear: false,
  onChangeYear() {},
  toggleYearOption() {},
  day: { label: 'Day', value: null },
  month: { label: 'Month', value: null },
  year: ''
}
