import React from 'react'
import Flex from 'styled-flex-component'

import { CheckBoxButton } from 'components/Button/CheckboxButton'
import Tooltip from 'components/tooltip'

import { Label } from './styled'

export class NotifyOffice extends React.Component {
  handleClick = () => {
    if (this.props.checklist.is_deactivated) {
      return false
    }

    return this.props.onChange({
      type: this.props.type,
      id: this.props.id,
      checklistId: this.props.checklist.id
    })
  }

  render() {
    const { props } = this

    return (
      <Flex onClick={this.handleClick} alignCenter>
        <Label>Notify Office</Label>

        <Tooltip
          placement="left"
          caption={
            props.checklist.is_deactivated
              ? 'You can not Notify Office for Backup offers'
              : null
          }
        >
          <CheckBoxButton
            onClick={this.handleClick}
            isSelected={this.props.isSelected}
            isDisabled={props.checklist.is_deactivated}
          />
        </Tooltip>
      </Flex>
    )
  }
}
