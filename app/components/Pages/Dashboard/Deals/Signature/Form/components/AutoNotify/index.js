import React, { Fragment } from 'react'

import Tooltip from 'components/tooltip'
import QuestionCircleIcon from 'components/SvgIcons/QuestionCircle/QuestionCircleIcon'

import { CheckBoxButton } from 'components/Button/CheckboxButton'
import { Container, Label } from './styled'

export function AutoNotify(props) {
  const handleToggle = () => props.input.onChange(!props.input.value)

  return (
    <Container>
      <CheckBoxButton isSelected={props.input.value} onClick={handleToggle} />
      <Label onClick={handleToggle}>Auto Notify</Label>

      <Tooltip caption="Automatically notify back office when all parties have signed.">
        <QuestionCircleIcon />
      </Tooltip>
    </Container>
  )
}
