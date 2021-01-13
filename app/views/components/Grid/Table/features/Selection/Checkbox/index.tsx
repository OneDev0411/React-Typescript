import React, { useState, useEffect, ChangeEvent } from 'react'
import {
  Checkbox as MUICheckbox,
  CheckboxProps as MUICheckBoxProp,
  Tooltip
} from '@material-ui/core'

interface Props extends Omit<MUICheckBoxProp, 'checked' | 'onChange'> {
  checked: boolean
  tooltipTitle?: string
  onChange: () => void
}

export default function Checkbox({
  checked,
  indeterminate,
  tooltipTitle,
  onChange,
  ...props
}: Props) {
  const [isChecked, setIsChecked] = useState<boolean>(checked)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const handleToggleRow = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setIsChecked(!isChecked)
    setTimeout(onChange, 0)
  }
  const checkBox = (
    <MUICheckbox
      {...props}
      color="secondary"
      checked={isChecked}
      indeterminate={indeterminate}
      onChange={handleToggleRow}
    />
  )

  if (tooltipTitle) {
    return (
      <Tooltip title={tooltipTitle} placement="top">
        {checkBox}
      </Tooltip>
    )
  }

  return checkBox
}
