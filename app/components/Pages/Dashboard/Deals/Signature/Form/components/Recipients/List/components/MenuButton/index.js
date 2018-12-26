import React from 'react'

import ActionButton from 'components/Button/ActionButton'
import { primary } from 'views/utils/colors'

import IconDrop from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export function MenuButton(props) {
  return (
    <ActionButton
      appearance="link"
      {...props}
      style={{
        padding: 0,
        margin: 0,
        fontWeight: 500,
        alignItems: 'center',
        ...props.style
      }}
    >
      {props.selectedItem && props.selectedItem.label}
      <IconDrop
        style={{
          fill: primary,
          marginLeft: '0.875rem',
          transform: `rotate(${props.isOpen} ? '90deg' : '0')`
        }}
      />
    </ActionButton>
  )
}
