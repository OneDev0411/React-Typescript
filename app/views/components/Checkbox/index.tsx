import React, { CSSProperties, ReactNode } from 'react'

import { useCuid } from 'hooks/use-cuid'

import { CheckMark, CheckMarkBox, Input, Label } from './styled'

interface Props {
  size?: number
  inputProps?: any
  id?: string
  checked: boolean
  onChange?: (event: Event) => void
  checkboxStyle?: CSSProperties
  containerStyle?: CSSProperties
  children?: ReactNode
}

Checkbox.defaultProps = {
  inputProps: {},
  checkboxStyle: { marginRight: '0.5rem' },
  containerStyle: {}
}

export function Checkbox(props: Props) {
  const cuid = useCuid()
  const { checkboxStyle } = props
  const { id = cuid, size = 16, checked } = props

  return (
    <Label htmlFor={id} style={props.containerStyle}>
      <Input
        id={id}
        type="checkbox"
        {...props.inputProps}
        onChange={props.onChange}
      />

      <CheckMarkBox size={size} checked={checked} style={checkboxStyle}>
        {checked && <CheckMark />}
      </CheckMarkBox>

      <div
        style={{
          width: `calc(100% - ${size / 16}rem - ${checkboxStyle &&
            checkboxStyle.marginRight})`
        }}
      >
        {props.children}
      </div>
    </Label>
  )
}
