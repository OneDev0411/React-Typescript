import React from 'react'
import {
  makeStyles,
  Theme,
  FormControlLabel,
  Switch,
  SwitchProps,
  Typography,
  TypographyProps,
  Tooltip
} from '@material-ui/core'
import classNames from 'classnames'

interface StyleProps {
  labelMargin: number
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      marginLeft: 0,
      marginRight: 0
    },
    label: {
      marginRight: ({ labelMargin }: StyleProps) => theme.spacing(labelMargin)
    }
  }),
  { name: 'LabeledSwitch' }
)

type TypographyExposedProps = 'variant' | 'children'
type TypographySettledProps = 'variant'
type SwitchExposedProps = 'checked' | 'onChange'
type SwitchSettledProps = 'size'

export interface LabeledSwitchProps
  extends Pick<TypographyProps, TypographyExposedProps>,
    Pick<SwitchProps, SwitchExposedProps>,
    Partial<StyleProps> {
  TypographyProps?: Partial<
    Omit<TypographyProps, TypographySettledProps | TypographyExposedProps>
  >
  SwitchProps?: Partial<
    Omit<SwitchProps, SwitchSettledProps | SwitchExposedProps> & {
      tooltip?: string
    }
  >
}

export default function LabeledSwitch({
  variant,
  children,
  TypographyProps,
  checked,
  onChange,
  SwitchProps,
  labelMargin = 2
}: LabeledSwitchProps) {
  const classes = useStyles({ labelMargin })

  const switchInput = (
    <Switch
      {...SwitchProps}
      size="small"
      checked={checked}
      onChange={onChange}
    />
  )

  return (
    <FormControlLabel
      className={classes.root}
      control={
        SwitchProps?.tooltip ? (
          <Tooltip title={SwitchProps?.tooltip}>
            <span>{switchInput}</span>
          </Tooltip>
        ) : (
          switchInput
        )
      }
      label={
        <Typography
          {...TypographyProps}
          variant={variant ?? 'body2'}
          className={classNames(TypographyProps?.className, classes.label)}
        >
          {children}
        </Typography>
      }
      labelPlacement="start"
    />
  )
}
