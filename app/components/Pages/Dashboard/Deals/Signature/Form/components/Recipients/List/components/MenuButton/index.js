import React from 'react'

import { Button } from '@material-ui/core'

import { primary } from 'views/utils/colors'

import IconDrop from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export function MenuButton(props) {
  return (
    <Button
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
          marginTop: '5px',
          transform: `rotate(${props.isOpen} ? '180deg' : '0')`
        }}
      />
    </Button>
  )
}
