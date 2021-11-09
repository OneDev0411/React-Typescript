import React from 'react'

import { Tooltip } from '@material-ui/core'
import Flex from 'styled-flex-component'

import { CheckBoxButton } from 'components/Button/CheckboxButton'

import { Label } from './styled'

export function NotifyOffice(props) {
  const handleClick = () => {
    if (props.checklist.is_deactivated) {
      return false
    }

    return props.onChange()
  }

  return (
    <Flex onClick={handleClick} alignCenter>
      <Label>Notify Office to Review</Label>

      <Tooltip
        placement="left"
        title={
          props.checklist.is_deactivated
            ? 'You can not Notify Office for Backup offers'
            : ''
        }
      >
        <CheckBoxButton
          onClick={handleClick}
          isSelected={props.isSelected}
          isDisabled={props.checklist.is_deactivated}
        />
      </Tooltip>
    </Flex>
  )
}
