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
  checkboxStyle: { marginRight: '0.5em' },
  containerStyle: {}
}

export function Checkbox(props: Props) {
  const cuid = useCuid()

  const { id = cuid, size = 16, checked } = props

  return (
    <Label htmlFor={id} style={props.containerStyle}>
      <Input
        id={id}
        type="checkbox"
        {...props.inputProps}
        onChange={props.onChange}
      />

      <CheckMarkBox size={size} checked={checked} style={props.checkboxStyle}>
        {checked && <CheckMark />}
      </CheckMarkBox>

      {props.children}
    </Label>
  )
}
