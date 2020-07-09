import React from 'react'
import PropTypes from 'prop-types'

import { mdiClockOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import useTime from './useTime'
import { twelveFormat, formatNumber } from './helpers'
import { TimeInputContainer } from './styled'

TimeInput.propTypes = {
  id: PropTypes.string,
  defaultDate: PropTypes.instanceOf(Date),
  initialDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired
}
TimeInput.defaultProps = {
  id: 'default',
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
      <span className="icon">
        <SvgIcon path={mdiClockOutline} size={muiIconSizes.small} />
      </span>
      <div className="time">
        <input
          id={`TimeInput-hours--${props.id}`}
          type="number"
          onKeyDown={time.onChangeHours}
          value={time.hours}
          readOnly
        />
        <label htmlFor={`TimeInput-hours--${props.id}`}>
          {formatNumber(twelveFormat(time.hours))}
        </label>
      </div>
      <span>:</span>
      <div className="time">
        <input
          id={`TimeInput-minutes--${props.id}`}
          type="number"
          onKeyDown={time.onChangeMinutes}
          value={time.minutes}
          readOnly
        />
        <label htmlFor={`TimeInput-minutes--${props.id}`}>
          {formatNumber(time.minutes)}
        </label>
      </div>
      <div className="meridian">
        <input
          id={`TimeInput-meridian--${props.id}`}
          type="text"
          onKeyDown={time.onChangeMeridian}
          value={time.meridian}
          readOnly
        />
        <label htmlFor={`TimeInput-meridian--${props.id}`}>
          {time.meridian}
        </label>
      </div>
    </TimeInputContainer>
  )
}

export default TimeInput
