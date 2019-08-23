import React, { useState, useRef } from 'react'
import debounce from 'lodash/debounce'
import fecha from 'fecha'

import List from 'components/Calendar'
import { CalendarRef } from 'components/Calendar/types'

import DatePicker from 'components/DatePicker'

import { TodayButton } from './components/TodayButton'
import Filters, { FiltersRef } from './components/Filters'
import { Export } from './components/Export'
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
  const filtersRef = useRef<FiltersRef>(null)

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
   * keeps list of fetched days
   */
  const [isLoadingFilters, setIsLoadingFilters] = useState<boolean>(true)

  /**
   * current filters
   */
  const [filter, setFilter] = useState<object>({})

  /**
   * triggers when user clicks on a date in datepicker of left side
   * @param date
   */
  const handleDatePickerChange = (date: Date = new Date()) => {
    if (calendarRef.current) {
      calendarRef.current.jumpToDate(date)
    }
  }

  /**
   * triggers when user creates a new event
   * @param event
   * @param type
   */
  const handleEventChange = (event: IEvent, type: string): void => {
    // set filters to All Events when creating a new event
    if (type === 'created') {
      filtersRef.current!.changeFilter(0)
    }

    calendarRef.current!.updateCrmEvents(event, type)
  }

  /**
   * triggers when new data is fetched by calendar
   * @param events
   */
  const handleOnLoadEvents = (events: CalendarEventsList) => {
    setFetchedDays(Object.keys(events))
    setIsLoadingFilters(false)
  }

  /**
   * triggers when user changes the calendar filter
   * @param filter
   */
  const handleChangeFilter = (filter: object) => {
    setFilter(filter)
    setIsLoadingFilters(true)
  }

  /**
   * returns list of empty date in the fetched range of calendar
   * @param day
   */
  const getEmptyDays = (day: Date) => {
    return !fetchedDays.includes(fecha.format(day, 'YYYY/M/D'))
  }

  return (
    <Container>
      <Sidebar>
        <div>
          <SideHeader>
            <Title>Calendar</Title>

            <TodayButton onClick={() => handleDatePickerChange()} />
          </SideHeader>

          <DatePicker
            modifiers={{ empty: getEmptyDays }}
            selectedDate={activeDate}
            onChange={handleDatePickerChange}
          />
        </div>

        <Export />
      </Sidebar>

      <Main>
        <Header>
          <Filters
            ref={filtersRef}
            onChange={handleChangeFilter}
            isLoadingFilters={isLoadingFilters}
          />
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
