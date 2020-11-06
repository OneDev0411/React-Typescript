import React, { ChangeEvent } from 'react'

import {
  Slider as BaseSlider,
  Box,
  Typography,
  TextField,
  Theme,
  makeStyles
} from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    input: {
      padding: theme.spacing(0.5, 1.5),
      width: theme.spacing(9),
      fontSize: theme.spacing(1.75),
      textAlign: 'center'
    },
    slider: {
      margin: theme.spacing(0, 2)
    }
  }),
  {
    name: 'ImageEditorSlider'
  }
)

interface Props {
  min: number
  max: number
  caption: string
  value: number
  disabled?: boolean
  onChange: (value: number | null) => void
}

export function Slider({
  min,
  max,
  caption,
  value,
  disabled,
  onChange
}: Props) {
  const classes = useStyles()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)

    if (Number.isNaN(value) || value < min || value > max) {
      onChange(null)

      return
    }

    onChange(value)
  }

  return (
    <Box display="flex" alignItems="center" width="30%">
      <Typography variant="caption">{caption}</Typography>

      <BaseSlider
        min={min}
        max={max}
        className={classes.slider}
        disabled={disabled}
        value={value}
        color="secondary"
        onChange={(_, value) => onChange(value as number)}
      />

      <TextField
        value={value}
        disabled={disabled}
        variant="outlined"
        size="small"
        inputProps={{
          className: classes.input,
          pattern: '[0-9]{1,2}'
        }}
        onChange={handleChange}
      />
    </Box>
  )
}
