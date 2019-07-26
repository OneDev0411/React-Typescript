import React, { useState } from 'react'
import debounce from 'lodash/debounce'

import { LoadingPosition } from 'components/VirtualList'
import DatePicker from 'components/DatePicker'

import { useLoadCalendar } from './hooks/use-load-calendar'
import { getDateRange, Format } from './helpers/get-date-range'

import CalendarTable from './components/Table'
import { TodayButton } from './components/Table/TodayButton'

import { Container, Sidebar, Header, Main, SideHeader, Title } from './styled'

interface Ranges {
  query: NumberRange
  calendar: NumberRange
}

interface IProps {
  range: NumberRange
  children: React.ReactNode
}

const Calendar: React.FC = (props: IProps) => {
  const [activeDate, setActiveDate] = useState<Date>(new Date())
  const [ranges, setRanges] = useState<Ranges>(getInitialRanges())
  const [viewAsUsers, setViewAsUsers] = useState<UUID[]>([])
  const [loadingPosition, setLoadingPosition] = useState<LoadingPosition>(
    LoadingPosition.Middle
  )

  const { events, isLoading } = useLoadCalendar({
    range: ranges.query,
    users: viewAsUsers
  })

  /**
   * handles updating ranges when user is trying to fetch future events
   */
  const handleLoadNextEvents = (): void => {
    if (isLoading) {
      return
    }

    // new range will be from end range of current calendar till next range
    const query: NumberRange = getDateRange(
      ranges.calendar[1] * 1000,
      Format.Next
    )

    // new range will be from start of calendar until end of new query range
    const calendar: NumberRange = [ranges.calendar[0], query[1]]

    // the loading indicator will be shown at the bottom of list
    setLoadingPosition(LoadingPosition.Bottom)

    setRanges({
      query,
      calendar
    })
  }

  /**
   * handles updating ranges when user is trying to fetch past events
   */
  const handleLoadPreviousEvents = (): void => {
    if (isLoading) {
      return
    }

    // new range will be from start range of current calendar
    const query: NumberRange = getDateRange(
      ranges.calendar[0] * 1000,
      Format.Previous
    )

    // new range will be from start of new range until end of new calendar range
    const calendar: NumberRange = [query[0], ranges.calendar[1]]

    // the loading indicator will be shown at the top of list
    setLoadingPosition(LoadingPosition.Top)

    setRanges({
      query,
      calendar
    })
  }

  return (
    <Container>
      <Sidebar>
        <SideHeader>
          <Title>Calendar</Title>

          <TodayButton onClick={() => alert()} />
        </SideHeader>

        <DatePicker selectedDate={activeDate} onChange={() => {}} />
      </Sidebar>

      <Main>
        <Header>---</Header>

        <CalendarTable
          events={events}
          isLoading={isLoading}
          loadingPosition={loadingPosition}
          onReachEnd={handleLoadNextEvents}
          onReachStart={handleLoadPreviousEvents}
          onChangeActiveDate={debounce(setActiveDate, 100)}
        />
      </Main>
    </Container>
  )
}

/**
 * returns initial range of query and calendar
 */
function getInitialRanges(): Ranges {
  const date = getDateRange()

  return {
    query: date,
    calendar: date
  }
}

export default Calendar
