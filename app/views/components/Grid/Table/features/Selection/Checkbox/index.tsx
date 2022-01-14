import React, { useState, useEffect, ChangeEvent } from 'react'

import {
  Checkbox as MUICheckbox,
  CheckboxProps as MUICheckBoxProp,
  Tooltip,
  makeStyles
} from '@material-ui/core'

interface Props extends Omit<MUICheckBoxProp, 'checked' | 'onChange'> {
  checked: boolean
  tooltipTitle?: string
  onChange: () => void
}

const useStyles = makeStyles(
  theme => ({
    checkBox: {
      padding: theme.spacing(0.25)
    }
  }),
  { name: 'ContactCheckBox' }
)

export default function Checkbox({
  checked,
  indeterminate,
  tooltipTitle,
  onChange,
  ...props
}: Props) {
  const [isChecked, setIsChecked] = useState<boolean>(checked)
  const classes = useStyles()

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
      size="small"
      className={classes.checkBox}
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
