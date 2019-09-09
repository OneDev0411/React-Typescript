import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { addNotification, Notification } from 'reapop'

import useInput from 'hooks/use-input'

import { Container, Icon, Label, Input } from './styled'

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
    <Container>
      <Icon />
      <Label>Touch Reminder</Label>
      <Input
        value={value.toString()}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleUpdate}
        data-test="touch-reminder-input"
      />
      <Label data-test="touch-reminder-days" bold>
        Days
      </Label>
    </Container>
  )
}

export default connect(
  null,
  {
    notify: addNotification
  }
)(TouchReminder)
