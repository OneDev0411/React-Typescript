import React, { useState, useEffect, useCallback } from 'react'
import { connect, Dispatch } from 'react-redux'
import { addNotification, Notification } from 'reapop'

import { CRM_LIST_DEFAULT_ASSOCIATIONS } from 'models/contacts/helpers'
import { updateFilterSegment } from 'actions/filter-segments'
import { CONTACTS_SEGMENT_NAME } from 'crm/constants'

import { Container, Icon, Label, Input } from './styled'

const DEFAULT_QUERY = {
  associations: CRM_LIST_DEFAULT_ASSOCIATIONS
}

interface TouchReminderProps {
  activeSegment: IContactList
  updateSegment: (
    namespace: string,
    segment: IContactList,
    query?: any
  ) => (dispatch: Dispatch<any>) => Promise<any>
  notify: (notification: Notification) => any
}

function TouchReminder({
  activeSegment,
  updateSegment,
  notify
}: TouchReminderProps) {
  const [value, setValue] = useState(activeSegment.touch_freq || 0)

  useEffect(() => {
    setValue(activeSegment.touch_freq || 0)
  }, [activeSegment.id, activeSegment.touch_freq])

  function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const newValue = parseInt(ev.target.value, 10)

    setValue(Number.isNaN(newValue) ? 0 : newValue)
  }

  function handleFocus(ev: React.FocusEvent<HTMLInputElement>) {
    ev.currentTarget.select()
  }

  function handleKeyPress(ev: React.KeyboardEvent<HTMLInputElement>) {
    const eventTargetValue = parseInt(ev.key, 10)

    // It's some other key like Backspace
    if (Number.isNaN(eventTargetValue)) {
      return
    }

    const currentValue = value.toString()

    const selectionRange =
      Number(ev.currentTarget.selectionEnd) -
      Number(ev.currentTarget.selectionStart)

    // It's a numeric input key
    // But we already reached 5 digits and the user has not selected any text inside
    if (
      currentValue.length === 5 &&
      selectionRange === 0 &&
      eventTargetValue <= 9
    ) {
      return ev.preventDefault()
    }
  }

  const handleUpdate = useCallback(async () => {
    if ((activeSegment.touch_freq || 0) === value) {
      return
    }

    try {
      const segment: IContactList = {
        ...activeSegment,
        touch_freq: value === 0 ? undefined : value
      }

      await updateSegment(CONTACTS_SEGMENT_NAME, segment, DEFAULT_QUERY)
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
  }, [activeSegment, notify, updateSegment, value])

  return (
    <Container>
      <Icon />
      <Label>Touch Reminder</Label>
      <Input
        value={value.toString()}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleUpdate}
        onKeyPress={handleKeyPress}
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
    updateSegment: updateFilterSegment,
    notify: addNotification
  }
)(TouchReminder)
