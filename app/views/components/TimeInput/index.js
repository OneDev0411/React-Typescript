import React from 'react'
import PropTypes from 'prop-types'

import IconTime from '../SvgIcons/Time/IconTime'

import useTime from './useTime'
import { twelveFormat, formatNumber } from './helpers'
import { TimeInputContainer } from './styled'

TimeInput.propTypes = {
  defaultDate: PropTypes.instanceOf(Date),
  initialDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired
}
TimeInput.defaultProps = {
  defaultDate: new Date()
}
function TimeInput(props) {
  const [time] = useTime({
    defaultDate: props.defaultDate,
    initialDate: props.initialDate,
    onChange: props.onChange
  })

  return (
    <TimeInputContainer>
      <div className="time">
        <input
          id="TimeInput-hours"
          type="number"
          onKeyDown={time.onChangeHours}
          value={time.hours}
          readOnly
        />
        <label htmlFor="TimeInput-hours">
          {formatNumber(twelveFormat(time.hours))}
        </label>
      </div>
      <span>:</span>
      <div className="time">
        <input
          id="TimeInput-minutes"
          type="number"
          onKeyDown={time.onChangeMinutes}
          value={time.minutes}
          readOnly
        />
        <label htmlFor="TimeInput-minutes">{formatNumber(time.minutes)}</label>
      </div>
      <div className="meridian">
        <input
          id="TimeInput-meridian"
          type="text"
          onKeyDown={time.onChangeMeridian}
          value={time.meridian}
          readOnly
        />
        <label htmlFor="TimeInput-meridian">{time.meridian}</label>
      </div>
      <span className="icon">
        <IconTime />
      </span>
    </TimeInputContainer>
  )
}

export default TimeInput
