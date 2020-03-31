import React, { useContext } from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core'

import MiniContactProfile from 'components/MiniContact'

import { getTrimmedArrayAndOthersText } from 'utils/get-trimmed-array-and-others-text'

import { sharedStyles } from '../../styles'
import { ListContext } from '../../../context'

interface Props {
  event: ICalendarEvent
  onEventChange(event: IEvent, type: string): void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    association: {
      fontWeight: 500,
      color: theme.palette.primary.main,
      cursor: 'pointer'
    }
  })
)

const useSharedStyles = makeStyles(sharedStyles)

export function Associations({ event, onEventChange }: Props) {
  const classes = useStyles()
  const sharedStyles = useSharedStyles({})
  const { setSelectedEvent } = useContext(ListContext)

  if (!event.people) {
    return null
  }

  const { visibleItems: contacts, othersText } = getTrimmedArrayAndOthersText(
    event.people,
    { threshold: 2, totalCount: event.people_len! }
  )

  return (
    <>
      <span className={sharedStyles.splitter}>—</span>
      <span>
        {contacts.map((item: IContact, index: number) => (
          <React.Fragment key={index}>
            {index !== 0 && <>,&nbsp;</>}
            <MiniContactProfile
              as="span"
              data={item}
              type="event"
              onEventChange={onEventChange}
            >
              <a
                onClick={e => e.stopPropagation()}
                target="_blank"
                href={`/dashboard/contacts/${item.id}`}
              >
                {item.display_name}
              </a>
            </MiniContactProfile>
          </React.Fragment>
        ))}
        {othersText && (
          <>
            {' and '}
            <span
              className={classes.association}
              onClick={() => setSelectedEvent(event)}
            >
              {othersText}
            </span>
          </>
        )}
      </span>
    </>
  )
}
