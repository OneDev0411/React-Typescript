import React from 'react'
import {
  InputAdornment,
  Theme,
  makeStyles,
  createStyles
} from '@material-ui/core'
import ColorPicker from 'material-ui-color-picker'

import { FieldProps } from './types'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      colorPickerSquare: {
        border: `1px solid ${theme.palette.divider}`,
        width: theme.spacing(3),
        height: theme.spacing(3)
      }
    }),
  { name: 'MarketingSettingsColorField' }
)

export default function WeightField({
  value,
  label,
  onChange,
  name
}: FieldProps) {
  const classes = useStyles()

  return (
    <ColorPicker
      size="small"
      variant="outlined"
      label={label}
      value={value}
      TextFieldProps={{ value }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <span
              className={classes.colorPickerSquare}
              style={{
                backgroundColor: value
              }}
            />
          </InputAdornment>
        )
      }}
      onChange={(color?: string) => {
        if (!color) {
          return
        }

        onChange(name, color)
      }}
    />
  )
}
