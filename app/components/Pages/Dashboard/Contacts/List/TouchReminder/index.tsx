import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { Typography, Theme, makeStyles } from '@material-ui/core'
import { mdiBellOutline } from '@mdi/js'

import { addNotification, Notification } from 'components/notification'

import useInput from 'hooks/use-input'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      minHeight: '42px',
      padding: theme.spacing(1),
      borderRadius: `${theme.shape.borderRadius}px`,
      border: `1px solid ${theme.palette.action.disabledBackground}`
    },
    icon: {
      color: theme.palette.grey[500]
    },
    label: {
      color: theme.palette.grey[600],
      margin: 0
    },
    input: {
      outline: 'none',
      border: 'none',
      borderBottom: `1px solid ${theme.palette.divider}`,
      textAlign: 'center',
      color: theme.palette.primary.main,
      width: '3rem',
      margin: theme.spacing(0, 1),
      ...theme.typography.body2
    },
    inputPosifix: {
      margin: 0,
      fontWeight: 'bold'
    }
  }),
  { name: 'TouchReminder' }
)

interface TouchReminderProps {
  value?: number
  onChange: (value?: number) => Promise<void>
  notify: (notification: Notification) => any
}

function TouchReminder({
  value: passedValue,
  onChange: passedOnChange,
  notify
}: TouchReminderProps) {
  const classes = useStyles()
  const { value, onChange, setValue } = useInput({
    pattern: /^[0-9]{0,5}$/
  })

  useEffect(() => {
    setValue(passedValue || 0)
  }, [passedValue, setValue])

  const handleUpdate = useCallback(async () => {
    if ((passedValue || 0) === value) {
      return
    }

    try {
      const numericValue = Number(value)

      await passedOnChange(numericValue === 0 ? undefined : numericValue)
      notify({
        status: 'success',
        message: 'Touch reminder updated'
      })
    } catch (err) {
      notify({
        status: 'error',
        message:
          'Something went wrong while updating touch reminder. Please try again.'
      })
      console.error(err)
    }
  }, [notify, passedOnChange, passedValue, value])

  function handleFocus(ev: React.FocusEvent<HTMLInputElement>) {
    ev.currentTarget.select()
  }

  return (
    <div className={classes.container}>
      <SvgIcon path={mdiBellOutline} className={classes.icon} rightMargined />
      <Typography variant="body2" className={classes.label}>
        Remind to touch every
      </Typography>
      <input
        className={classes.input}
        value={value.toString()}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleUpdate}
        data-test="touch-reminder-input"
      />
      <Typography
        variant="body2"
        className={classes.inputPosifix}
        data-test="touch-reminder-days"
      >
        Days
      </Typography>
    </div>
  )
}

export default connect(null, {
  notify: addNotification
})(TouchReminder)
