import React from 'react'
import {
  FormControlLabel,
  Switch,
  SwitchProps,
  Typography,
  Theme,
  TypographyProps
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginLeft: 0,
    marginRight: 0
  }
}))

export interface LabeledSwitchInputProps
  extends Pick<TypographyProps, 'variant'>,
    Pick<SwitchProps, 'checked' | 'onChange'> {
  label?: string
  TypographyProps?: Partial<Omit<TypographyProps, 'children' | 'variant'>>
  SwitchProps?: Partial<Omit<SwitchProps, 'checked' | 'onChange'>>
}

export default function LabeledSwitchInput({
  label,
  TypographyProps,
  SwitchProps,
  variant,
  ...switchProps
}: LabeledSwitchInputProps) {
  const classes = useStyles()

  return (
    <FormControlLabel
      className={classes.root}
      control={<Switch {...SwitchProps} {...switchProps} />}
      label={
        label && (
          <Typography {...TypographyProps} variant={variant ?? 'body2'}>
            {label}
          </Typography>
        )
      }
      labelPlacement="start"
    />
  )
}
