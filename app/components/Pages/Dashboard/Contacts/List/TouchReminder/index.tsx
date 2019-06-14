import React, { useCallback } from 'react'
import { connect, Dispatch } from 'react-redux'
import { addNotification, Notification } from 'reapop'

import useInput from 'hooks/use-input'
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
  const { value, onChange } = useInput({
    initialValue: activeSegment.touch_freq || 0,
    pattern: /^[0-9]{0,5}$/
  })

  function handleFocus(ev: React.FocusEvent<HTMLInputElement>) {
    ev.currentTarget.select()
  }

  const handleUpdate = useCallback(async () => {
    if ((activeSegment.touch_freq || 0) === value) {
      return
    }

    try {
      const numericValue = Number(value)
      const segment: IContactList = {
        ...activeSegment,
        touch_freq: numericValue === 0 ? undefined : numericValue
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
    updateSegment: updateFilterSegment,
    notify: addNotification
  }
)(TouchReminder)
