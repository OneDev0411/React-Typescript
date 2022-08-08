import { ChangeEvent, useState } from 'react'

import {
  Box,
  Grid,
  makeStyles,
  Slider,
  Theme,
  Typography
} from '@material-ui/core'
import cn from 'classnames'
import { useDebounce } from 'react-use'

const useStyles = makeStyles(
  (theme: Theme) => ({
    caption: {
      color: theme.palette.grey[500],
      '&.has-value': {
        cursor: 'pointer',
        fontWeight: 700,
        color: theme.palette.grey[700]
      }
    },
    value: {
      color: theme.palette.grey[700],
      fontWeight: 600
    }
  }),
  {
    name: 'FilterSlider'
  }
)

interface Props {
  title: string
  defaultValue?: number
  min: number
  max: number
  step: number
  formatter?: (value: number) => number
  onChange: (value: number) => void
  onRemove: () => void
}

export function FilterSlider({
  title,
  defaultValue = 0,
  min,
  max,
  step,
  formatter,
  onChange,
  onRemove
}: Props) {
  const classes = useStyles()
  const [value, setValue] = useState(defaultValue)

  const handleChange = (_: ChangeEvent, newValue: number | number[]) => {
    setValue(newValue as number)
  }

  useDebounce(
    () => {
      if (value === defaultValue) {
        onRemove()
      } else {
        onChange(value)
      }
    },
    300,
    [value]
  )

  const handleReset = () => {
    if (value === defaultValue) {
      return
    }

    onRemove()
    setValue(defaultValue)
  }

  return (
    <Box width="300px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography
            variant="caption"
            className={cn(classes.caption, {
              'has-value': value !== defaultValue
            })}
            onClick={handleReset}
          >
            {title}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Slider
            color="secondary"
            track={false}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
          />
        </Grid>
        <Grid item>
          <Typography variant="caption" className={classes.value}>
            {formatter ? formatter(value).toFixed(0) : value}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
