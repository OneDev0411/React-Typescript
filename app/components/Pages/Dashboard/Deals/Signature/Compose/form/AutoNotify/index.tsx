import React from 'react'

import {
  makeStyles,
  Theme,
  Typography,
  Tooltip,
  Checkbox
} from '@material-ui/core'

import { useField } from 'react-final-form'

import QuestionCircleIcon from 'components/SvgIcons/QuestionCircle/QuestionCircleIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: theme.shape.borderRadius,
      border: `solid 1px ${theme.palette.divider}`,
      padding: theme.spacing(0, 1),
      height: '2.5rem',
      marginRight: theme.spacing(1)
    },
    label: {
      marginRight: theme.spacing(1),
      userSelect: 'none'
    }
  }),
  { name: 'SignatureAutoNotify' }
)

interface Props {
  disabled: boolean
}

export function AutoNotify({ disabled }: Props) {
  const classes = useStyles()
  const field = useField('auto_notify')

  const handleToggle = () => field.input.onChange(!field.input.value)

  return (
    <Tooltip title="Automatically notify back office when all parties have signed">
      <div className={classes.root}>
        <Checkbox
          disableRipple
          disabled={disabled}
          checked={field.input.value}
          onClick={handleToggle}
        />

        <Typography
          variant="body1"
          className={classes.label}
          onClick={handleToggle}
        >
          Auto Notify
        </Typography>

        <QuestionCircleIcon />
      </div>
    </Tooltip>
  )
}
