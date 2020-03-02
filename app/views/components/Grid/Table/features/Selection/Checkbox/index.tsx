import React, { useState, useEffect } from 'react'
import { Checkbox as MUICheckbox } from '@material-ui/core'

interface Props {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
}

export default function Checkbox({ checked, indeterminate, onChange }: Props) {
  const [isChecked, setIsChecked] = useState<boolean>(checked)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const handleToggleRow = () => {
    setIsChecked(!isChecked)
    setTimeout(onChange, 0)
  }

  return (
    <MUICheckbox
      color="secondary"
      checked={isChecked}
      indeterminate={indeterminate}
      onChange={handleToggleRow}
    />
  )
}
