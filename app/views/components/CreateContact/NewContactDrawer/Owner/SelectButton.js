import React from 'react'

import { Icon } from '../../../Dropdown'
import ActionButton from '../../../Button/ActionButton'

export function SelectButton(props) {
  return (
    <ActionButton
      {...props}
      appearance="link"
      size="large"
      inverse
      isBlock
      style={{
        justifyContent: 'space-between',
        fontWeight: 500,
        padding: 0
      }}
    >
      {props.selectedItem.label}
      <Icon style={{ marginTop: '0.2em' }} isOpen={props.isOpen} />
    </ActionButton>
  )
}
