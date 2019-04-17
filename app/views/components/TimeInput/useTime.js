import { useState, useCallback } from 'react'

import {
  twelveFormat,
  inRange,
  keyHandlerForMeridian,
  getMeridian,
  getMinutes,
  getHours,
  changeMeridian,
  changeHours
} from './helpers'

function useTime({ defaultDate, initialDate, onChange }) {
  // ---------- State ----------

  const [date, setDate] = useState(initialDate || defaultDate)

  if (initialDate && date !== initialDate) {
    setDate(initialDate)
  }

  // Updating state using types
  const setTime = useCallback(
    (type, value) => {
      // We need this to trigger renderer
      const newDate = new Date(date)

      if (type == 'minutes') {
        newDate.setMinutes(value)
      } else if (type == 'hours') {
        newDate.setHours(changeHours(newDate, value))
      } else if (type == 'meridian') {
        newDate.setHours(changeMeridian(newDate, value))
      }

      setDate(newDate)

      if (onChange) {
        onChange(newDate)
      }
    },
    [date]
  )

  // ---------- Event Handlers ----------

  const onChangeHours = useCallback(
    val => {
      val = Number(val)

      const lastHours = getHours(date)
      const lastValueInTwelveFormat = twelveFormat(lastHours)
      const nextHours = inRange({
        start: 1,
        end: 12,
        value: val,
        lastValue: lastValueInTwelveFormat
      })

      setTime('hours', nextHours)
    },
    [date]
  )

  const onChangeMinutes = useCallback(
    val => {
      val = Number(val)

      const lastMinutes = getMinutes(date)
      const nextMinuets = inRange({
        start: 1,
        end: 59,
        value: val,
        lastValue: lastMinutes
      })

      setTime('minutes', nextMinuets)
    },
    [date]
  )

  const onChangeMeridian = useCallback(
    val => {
      setTime('meridian', keyHandlerForMeridian(val, getMeridian(date)))
    },
    [date]
  )

  // ---------- end of event handlers ---------- //

  return [
    {
      // Output
      hours: getHours(date),
      minutes: getMinutes(date),
      meridian: getMeridian(date),

      // Events
      onChangeHours,
      onChangeMinutes,
      onChangeMeridian
    },
    setTime
  ]
}

export default useTime
