import React, { useState, useMemo, memo } from 'react'
import cn from 'classnames'
import { Popover, Button, IconButton } from '@material-ui/core'
import fecha from 'fecha'

import { mdiClose, mdiTrashCanOutline, mdiPencilOutline } from '@mdi/js'

import { deleteTask } from 'models/tasks'
import { CrmEventType } from 'components/Calendar/types'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'
import { importantDatesIcons as contactIcons } from 'views/utils/important-dates-icons'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import FollowUpModal from 'components/FollowUpModal'

import {
  isCRMEvent,
  isDealEvent,
  isCelebrationEvent
} from '../../../../helpers/normalize-events/helpers/event-checker'

import { usePopoverStyles } from '../../use-style'
import { BaseEventProps } from '../..'

import { getFormatDate } from './helper/get-format-date'

interface Props extends Pick<BaseEventProps, 'event' | 'rowEvent'> {
  el: HTMLDivElement | null
  onClose(): void
  onSelect(event: ICalendarEvent | null): void
  onChange(event: IEvent, type: CrmEventType): void
}

const EventCardComponent = ({
  el,
  event,
  rowEvent,
  onSelect,
  onChange,
  onClose
}: Props) => {
  const popoverClasses = usePopoverStyles()
  const [isFollowUpModalOpen, setFollowUpModalOpen] = useState(false)

  const open = Boolean(el)
  const id = open ? 'event-card-popover' : undefined

  const icon = useMemo(() => {
    if (rowEvent.object_type === 'contact_attribute') {
      if (contactIcons[rowEvent.type_label]) {
        return contactIcons[rowEvent.type_label]
      }

      if (
        rowEvent.type === 'birthday' ||
        rowEvent.event_type === 'child_birthday'
      ) {
        return contactIcons.Birthday
      }
    }

    if (isDealEvent(rowEvent)) {
      return eventIcons['Task Critical']
    }

    if (eventIcons[rowEvent.event_type]) {
      return eventIcons[rowEvent.event_type]
    }

    if (rowEvent.event_type === 'Message') {
      return eventIcons.Mail
    }

    return eventIcons.Other
  }, [rowEvent])
  const isDeal = useMemo(() => isDealEvent(rowEvent), [rowEvent])
  const isCelebration = useMemo(() => isCelebrationEvent(rowEvent), [rowEvent])

  const onCloseFollowUpModal = () => setFollowUpModalOpen(false)

  const handleDelete = async () => {
    try {
      await deleteTask(rowEvent.id)
      // @ts-ignore
      onChange(rowEvent, 'deleted')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={el}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <div className={popoverClasses.container}>
          <header className={popoverClasses.header}>
            <IconButton size="small" aria-label="close" onClick={onClose}>
              <SvgIcon path={mdiClose} />
            </IconButton>
            {isCRMEvent(rowEvent) && (
              <>
                <IconButton
                  size="small"
                  aria-label="delete"
                  onClick={handleDelete}
                >
                  <SvgIcon path={mdiTrashCanOutline} />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="edit"
                  onClick={() => onSelect(rowEvent)}
                >
                  <SvgIcon path={mdiPencilOutline} />
                </IconButton>
              </>
            )}
          </header>
          <div className={popoverClasses.body}>
            <div
              className={cn(popoverClasses.icon, {
                [popoverClasses.dealIcon]: isDeal,
                [popoverClasses.celebrationIcon]: isCelebration
              })}
            >
              <icon.icon />
            </div>
            <div className={popoverClasses.details}>
              <span className={popoverClasses.eventTitle}>
                {event.event.title}
              </span>
              <span className={popoverClasses.eventDate}>
                {getFormatDate(rowEvent)}
              </span>
            </div>
          </div>
          <footer className={popoverClasses.footer}>
            {(isDeal || isCelebration) && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => onSelect(rowEvent)}
              >
                {isCelebration ? 'Send Card' : 'View Deal'}
              </Button>
            )}
            {isCRMEvent(rowEvent) && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setFollowUpModalOpen(true)}
              >
                Follow Up
              </Button>
            )}
          </footer>
        </div>
      </Popover>
      {isFollowUpModalOpen && (
        <FollowUpModal
          isOpen
          dictionary={{
            description:
              'Never forget an event, put a reminder on your calendar now!',
            taskTitle: () => `Follow Up: ${event.event.title}`,
            taskDescription: (item, dueDate) =>
              `This is a follow up reminder ${
                event.event.title
              } set in Rechat, on ${fecha.format(
                dueDate,
                'dddd MMMM Do, YYYY'
              )}.`
          }}
          baseDate={new Date(rowEvent.timestamp * 1000)}
          onClose={onCloseFollowUpModal}
          callback={e => onChange(e, 'created')}
        />
      )}
    </>
  )
}

export const EventCard = memo(EventCardComponent)
