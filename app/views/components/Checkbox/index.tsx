import React, { CSSProperties, ReactNode } from 'react'
import classNames from 'classnames'
import { mdiCheck } from '@mdi/js'

import { useCuid } from 'hooks/use-cuid'

import { useVisuallyHiddenStyles } from '../../../styles/visually-hidden.style'
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
  const {
    id = cuid,
    size = 16,
    checked,
    inputProps,
    onChange,
    checkboxStyle,
    containerStyle,
    children
  } = props

  const classes = useVisuallyHiddenStyles({})

  return (
    <Label htmlFor={id} style={containerStyle}>
      <Input
        id={id}
        type="checkbox"
        {...inputProps}
        className={classNames(classes.root, (inputProps || {}).className)}
        onChange={onChange}
      />

      <CheckMarkBox size={size} checked={checked} style={checkboxStyle}>
        {checked && <CheckMark path={mdiCheck} />}
      </CheckMarkBox>

      <div
        style={{
          width: `calc(100% - ${size / 16}rem - ${
            (checkboxStyle && checkboxStyle.marginRight) || '0'
          })`
        }}
      >
        {children}
      </div>
    </Label>
  )
}
