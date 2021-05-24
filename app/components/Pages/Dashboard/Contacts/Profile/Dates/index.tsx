import React, { useEffect, useState } from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

import { getCalendar } from 'models/calendar/get-calendar'
import Loading from 'components/SvgIcons/BubblesSpinner/IconBubblesSpinner'

import SectionWithFields from '../components/SectionWithFields'

import { START_DATE, END_DATE } from './constants'
import DealContextField from './DealContextField'

const fieldsOrder = [
  'birthday',
  'child_birthday',
  'wedding_anniversary',
  'work_anniversary',
  'home_anniversary'
]

const useStyles = makeStyles(
  (theme: Theme) => ({
    loadingContainer: {
      padding: theme.spacing(0, 1),
      textAlign: 'center'
    }
  }),
  { name: 'ContactProfileDates' }
)

interface Props {
  contact: INormalizedContact
  submitCallback: (
    newContact: INormalizedContact,
    fallback?: () => void
  ) => void
}

export function Dates({ contact, submitCallback }: Props) {
  const classes = useStyles()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [otherFields, setOtherFields] = useState<ICalendarEvent[]>([])

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true)

        const homeAnniversaries = await getCalendar({
          range: [START_DATE, END_DATE],
          filter: {
            contact: contact.id,
            'event_types[]': ['home_anniversary'],
            'object_types[]': ['deal_context']
          }
        })

        setOtherFields(homeAnniversaries)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [contact.id])

  return (
    <>
      <SectionWithFields
        showTitleAnyway
        contact={contact}
        fieldsOrder={fieldsOrder}
        section="Dates"
        submitCallback={submitCallback}
        title="Touch Dates"
        expandButtonLabel="Add Birthdays & Anniversaries"
      >
        {isLoading ? (
          <Box className={classes.loadingContainer}>
            <Loading />
          </Box>
        ) : (
          <Box>
            {otherFields.map(field => (
              <DealContextField
                deal={field.deal || ''}
                key={field.id}
                title={field.title}
                value={field.timestamp}
              />
            ))}
          </Box>
        )}
      </SectionWithFields>
    </>
  )
}
