import React from 'react'
import {
  Grid,
  FormControl,
  InputAdornment,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'
import ColorPicker from 'material-ui-color-picker'

import { FieldProps } from './types'
import ImageField from './Image'
import FontField from './Font'
import PixelField from './Pixel'
import WeightField from './Weight'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      image: {
        width: '100%',
        height: 'auto'
      },
      colorPickerSquare: {
        border: `1px solid ${theme.palette.divider}`,
        width: theme.spacing(3),
        height: theme.spacing(3)
      }
    }),
  { name: 'MarketingSettingsField' }
)

export default function Field(props: FieldProps) {
  const classes = useStyles()

  return (
    <Grid container item>
      <FormControl fullWidth>
        {props.type === 'color' && (
          <ColorPicker
            size="small"
            variant="outlined"
            label={props.label}
            value={props.value}
            TextFieldProps={{ value: props.value }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span
                    className={classes.colorPickerSquare}
                    style={{
                      backgroundColor: props.value
                    }}
                  />
                </InputAdornment>
              )
            }}
            onChange={(color?: string) => {
              if (!color) {
                return
              }

              props.onChange(props.name, color)
            }}
          />
        )}
        {props.type === 'image' && <ImageField {...props} />}
        {props.type === 'font-family' && (
          <FontField {...props} onChange={props.onChange} />
        )}
        {props.type === 'pixel' && (
          <PixelField {...props} onChange={props.onChange} />
        )}
        {props.type === 'font-weight' && (
          <WeightField {...props} onChange={props.onChange} />
        )}
      </FormControl>
    </Grid>
  )
}
