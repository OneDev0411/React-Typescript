import React from 'react'
import fecha from 'fecha'
import idx from 'idx'
import Flex from 'styled-flex-component'
import { mdiBellOutline } from '@mdi/js'
import { makeStyles } from '@material-ui/styles'

import { Divider } from 'components/Divider'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { getReminderLabel } from 'views/utils/reminder'
import { eventTypesIcons } from 'views/utils/event-types-icons'

import EmailMeta from './EmailMeta'

const useStyles = makeStyles(
  theme => ({
    bellIcon: {
      marginRight: theme.spacing(0.5),
      color: theme.palette.text.secondary
    }
  }),
  { name: 'MetaInfo' }
)

export function MetaInfo(props) {
  const classes = useStyles()
  const { task } = props
  const { task_type, reminders } = task
  const email = idx(
    task,
    t =>
      t.associations.filter(a => a.association_type === 'email')[0].email
        .emails[0]
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
            style={{ marginLeft: '1.5em' }}
            onClick={props.onEdit}
            className="u-cursor--pointer"
          >
            <SvgIcon
              path={mdiBellOutline}
              className={classes.bellIcon}
              size={muiIconSizes.small}
            />
            <span>
              {getReminderLabel(
                task.due_date * 1000,
                task.reminders[0].timestamp * 1000
              )}
            </span>
          </Flex>
        )}
      </Flex>
      {email && props.defaultAssociationType === 'contact' && (
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
