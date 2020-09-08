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

type TypographyExposedProps = 'variant' | 'children'
type TypographySettledProps = 'variant'
type SwitchExposedProps = 'checked' | 'onChange'
type SwitchSettledProps = 'size'

export interface LabeledSwitchProps
  extends Pick<TypographyProps, TypographyExposedProps>,
    Pick<SwitchProps, SwitchExposedProps> {
  TypographyProps?: Partial<
    Omit<TypographyProps, TypographySettledProps | TypographyExposedProps>
  >
  SwitchProps?: Partial<
    Omit<SwitchProps, SwitchSettledProps | SwitchExposedProps>
  >
}

export default function LabeledSwitch({
  variant,
  children,
  TypographyProps,
  checked,
  onChange,
  SwitchProps
}: LabeledSwitchProps) {
  const classes = useStyles()

  return (
    <FormControlLabel
      className={classes.root}
      control={
        <Switch
          {...SwitchProps}
          size="small"
          checked={checked}
          onChange={onChange}
        />
      }
      label={
        <Typography {...TypographyProps} variant={variant ?? 'body2'}>
          {children}&nbsp;&nbsp;&nbsp;
        </Typography>
      }
      labelPlacement="start"
    />
  )
}
