import React, { useMemo, memo } from 'react'
import cn from 'classnames'
import { Popover, Button, IconButton } from '@material-ui/core'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'
import { importantDatesIcons as contactIcons } from 'views/utils/important-dates-icons'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import IconDeleteOutline from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import EditIcon from 'components/SvgIcons/Edit/EditIcon'

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
}

const EventCardComponent = ({
  el,
  event,
  rowEvent,
  onSelect,
  onClose
}: Props) => {
  const popoverClasses = usePopoverStyles()
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

  return (
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
            <CloseIcon size="small" />
          </IconButton>
          {isCRMEvent(rowEvent) && (
            <>
              <IconButton
                size="small"
                aria-label="delete"
                onClick={e => {
                  e.stopPropagation()
                  console.log('f')
                }}
              >
                <IconDeleteOutline />
              </IconButton>
              <IconButton
                size="small"
                aria-label="edit"
                onClick={() => onSelect(rowEvent)}
              >
                <EditIcon size="small" />
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
          <Button
            variant="outlined"
            size="small"
            onClick={() => onSelect(rowEvent)}
          >
            Follow Up
          </Button>
        </footer>
      </div>
    </Popover>
  )
}

export const EventCard = memo(EventCardComponent)
