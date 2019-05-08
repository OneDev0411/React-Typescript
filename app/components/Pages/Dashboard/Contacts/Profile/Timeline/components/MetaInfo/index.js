import React from 'react'
import fecha from 'fecha'
import idx from 'idx'
import Flex from 'styled-flex-component'

import { Divider } from 'components/Divider'
import IconBell from 'components/SvgIcons/Bell/IconBell'

import { getReminderLabel } from 'views/utils/reminder'
import { eventTypesIcons } from 'views/utils/event-types-icons'

import EmailMeta from './EmailMeta'

export function MetaInfo(props) {
  const { task } = props
  const { task_type, reminders } = task
  const email = idx(
    task,
    t =>
      t.associations.filter(a => a.association_type === 'email')[0].email
        .emails[0].email
  )

  let iconColor = '#000'
  let Icon = eventTypesIcons.Other.icon

  if (eventTypesIcons[task_type]) {
    Icon = eventTypesIcons[task_type].icon

    if (eventTypesIcons[task_type].color) {
      iconColor = eventTypesIcons[task_type].color
    }
  }

  const showReminder =
    task.status !== 'DONE' &&
    reminders &&
    reminders.length > 0 &&
    task.reminders[0].timestamp * 1000 > new Date().getTime() - 24 * 3600000

  return (
    <Flex alignCenter style={{ marginBottom: '2em' }}>
      <Flex alignCenter onClick={props.onEdit} className="u-cursor--pointer">
        <Icon style={{ marginRight: '0.5em', fill: iconColor }} />
        <span style={{ fontWeight: 500 }}>{task_type}</span>
      </Flex>
      <Divider margin="0 0.5em" width="1px" height="16px" />
      <Flex alignCenter style={{ color: '#7f7f7f' }}>
        <div className="u-cursor--pointer" onClick={props.onEdit}>
          {fecha.format(new Date(task.due_date * 1000), 'MMM D, YYYY hh:mm A')}
        </div>
        {showReminder && (
          <Flex
            alignCenter
            style={{ marginLeft: '1em' }}
            onClick={props.onEdit}
            className="u-cursor--pointer"
          >
            <IconBell style={{ fill: '#7f7f7f' }} />
            <span>
              {getReminderLabel(
                task.due_date * 1000,
                task.reminders[0].timestamp * 1000
              )}
            </span>
          </Flex>
        )}
      </Flex>
      {email && (
        <EmailMeta
          bounced={email.failed > 0}
          unsubscribed={email.unsubscribed > 0}
          opened={email.opened}
          clicked={email.clicked}
        />
      )}
    </Flex>
  )
}
