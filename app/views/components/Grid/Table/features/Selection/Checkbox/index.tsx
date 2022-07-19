import { useState, useEffect, ChangeEvent } from 'react'

import {
  Checkbox as MUICheckbox,
  CheckboxProps as MUICheckBoxProp,
  makeStyles,
  Tooltip
} from '@material-ui/core'

const useStyles = makeStyles(
  () => ({
    root: {
      padding: 0,
      '&:hover': {
        backgroundColor: 'transparent'
      }
    }
  }),
  {
    name: 'Grid-SelectionCheckbox'
  }
)

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
      classes={{ root: classes.root }}
      color="primary"
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
