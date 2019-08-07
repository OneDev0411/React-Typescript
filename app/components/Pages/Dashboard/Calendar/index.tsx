import React, { useState, useRef } from 'react'
import debounce from 'lodash/debounce'
import fecha from 'fecha'

import List from 'components/Calendar'
import { CalendarRef } from 'components/Calendar/types'

import DatePicker from 'components/DatePicker'

import { TodayButton } from './components/TodayButton'
import { Filters } from './components/Filters'
import CreateEvent from './components/CreateEvent'

import {
  Container,
  ListContainer,
  Sidebar,
  Header,
  Main,
  SideHeader,
  Title
} from './styled'

const CalendarPage: React.FC = props => {
  const calendarRef = useRef<CalendarRef>(null)

  /*
   * current active date of Calendar. the first visible day of day in
   * list will be active date
   */
  const [activeDate, setActiveDate] = useState<Date>(new Date())

  /**
   * keeps list of fetched days
   */
  const [fetchedDays, setFetchedDays] = useState<string[]>([])

  /**
   * current filters
   */
  const [filter, setFilter] = useState<object>({})

  const handleDatePickerChange = (date: Date = new Date()) => {
    calendarRef.current!.jumpToDate(date)
  }

  const handleEventChange = (event: IEvent, type: string) => {
    calendarRef.current!.updateCrmEvents(event, type)
  }

  const handleOnLoadEvents = (events: CalendarEventsList) =>
    setFetchedDays(Object.keys(events))

  const getEmptyDays = (day: Date) => {
    return !fetchedDays.includes(fecha.format(day, 'YYYY/M/D'))
  }

  return (
    <Container>
      <Sidebar>
        <SideHeader>
          <Title>Calendar</Title>

          <TodayButton onClick={() => handleDatePickerChange()} />
        </SideHeader>

        <DatePicker
          fixedWeeks
          modifiers={{ empty: getEmptyDays }}
          selectedDate={activeDate}
          onChange={handleDatePickerChange}
        />
      </Sidebar>

      <Main>
        <Header>
          <Filters onChange={setFilter} />
          <CreateEvent
            onEventChange={handleEventChange}
            activeDate={activeDate}
          />
        </Header>

        <ListContainer className="u-scrollbar--thinner">
          <List
            ref={calendarRef}
            filter={filter}
            onChangeActiveDate={debounce(setActiveDate, 100)}
            onLoadEvents={handleOnLoadEvents}
          />
        </ListContainer>
      </Main>
    </Container>
  )
}

export default CalendarPage
