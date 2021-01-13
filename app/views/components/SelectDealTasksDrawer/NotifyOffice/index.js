import React from 'react'
import Flex from 'styled-flex-component'

import { Tooltip } from '@material-ui/core'

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
      <Label>Notify Office</Label>

      <Tooltip
        placement="left"
        title={
          props.checklist.is_deactivated
            ? 'You can not Notify Office for Backup offers'
            : null
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
