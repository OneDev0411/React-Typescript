import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Icon from '../../SvgIcons/CheckCircle/IconCheckCircle'

// visually hidden
const Checkbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`

const Label = styled.label`
  margin: 0;
  font-size: 0;
  cursor: pointer;
`

CircleCheckbox.propTypes = {
  size: PropTypes.number,
  id: PropTypes.string.isRequired,
  input: PropTypes.shape().isRequired
}

CircleCheckbox.defaultProps = {
  size: 32
}

export function CircleCheckbox(props) {
  const { input, id, size } = props
  const { value } = input

  return (
    <Fragment>
      <Label htmlFor={id}>
        <Icon
          checked={value === 'DONE'}
          style={{ width: size, height: size }}
        />
      </Label>
      <Checkbox
        {...input}
        id={id}
        type="checkbox"
        onChange={() => input.onChange(value === 'DONE' ? 'PENDING' : 'DONE')}
      />
    </Fragment>
  )
}
