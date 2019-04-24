import { useState, useCallback } from 'react'

import {
  twelveFormat,
  inRange,
  keyHandlerForMeridian,
  getMeridian,
  getMinutes,
  getHours,
  changeMeridian,
  changeHours,
  handleArrowKeys
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
    [date, onChange]
  )

  // ---------- Event Handlers ----------

  const onChangeHours = useCallback(
    e => {
      const lastHours = getHours(date)
      const arrowDirection = handleArrowKeys(e)
      let lastValueInTwelveFormat = twelveFormat(lastHours)
      let val = Number(e.key)

      if (arrowDirection.up) {
        val = lastValueInTwelveFormat >= 12 ? 12 : lastValueInTwelveFormat + 1

        // preventing concat
        if (lastValueInTwelveFormat <= 9) {
          lastValueInTwelveFormat = 0
        }
      }

      if (arrowDirection.down) {
        // preventing concat
        if (lastValueInTwelveFormat <= 1) {
          lastValueInTwelveFormat = 0
          val = 1
        } else {
          val = lastValueInTwelveFormat - 1
        }
      }

      const nextHours = inRange({
        start: 1,
        end: 12,
        value: val,
        lastValue: lastValueInTwelveFormat
      })

      setTime('hours', nextHours)
    },
    [date, setTime]
  )

  const onChangeMinutes = useCallback(
    e => {
      const arrowDirection = handleArrowKeys(e)
      let lastMinutes = getMinutes(date)
      let val = Number(e.key)

      if (arrowDirection.up) {
        val = lastMinutes >= 59 ? 59 : lastMinutes + 1

        // preventing concat
        if (lastMinutes <= 9) {
          lastMinutes = 0
        }
      }

      if (arrowDirection.down) {
        // preventing concat
        if (lastMinutes <= 5) {
          lastMinutes = 0
          val = 1
        } else {
          val = lastMinutes - 1
        }
      }

      const nextMinuets = inRange({
        start: 1,
        end: 59,
        value: val,
        lastValue: lastMinutes
      })

      setTime('minutes', nextMinuets)
    },
    [date, setTime]
  )

  const onChangeMeridian = useCallback(
    e => {
      setTime('meridian', keyHandlerForMeridian(e, getMeridian(date)))
    },
    [date, setTime]
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
