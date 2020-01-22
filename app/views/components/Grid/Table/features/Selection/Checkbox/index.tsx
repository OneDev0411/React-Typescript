import React, { useState, useEffect } from 'react'
import { Checkbox } from '@material-ui/core'

interface Props {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
}

export default function CheckboxWithState({
  checked,
  indeterminate,
  onChange
}: Props) {
  const [isChecked, setIsChecked] = useState<boolean>(checked)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const handleToggleRow = () => {
    setIsChecked(!isChecked)
    setTimeout(onChange, 0)
  }

  return (
    <Checkbox
      color="primary"
      checked={isChecked}
      indeterminate={indeterminate}
      onChange={handleToggleRow}
    />
  )
}
