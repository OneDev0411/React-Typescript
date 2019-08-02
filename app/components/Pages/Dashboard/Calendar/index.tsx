import React, { useState, useRef } from 'react'
import debounce from 'lodash/debounce'

import List, { CalendarRef } from 'components/Calendar'
import DatePicker from 'components/DatePicker'

import { TodayButton } from './components/TodayButton'
import { Filters } from './components/Filters'
import CreateEvent from './components/CreateEvent'

import { Container, Sidebar, Header, Main, SideHeader, Title } from './styled'

const CalendarPage: React.FC = props => {
  const calendarRef = useRef<CalendarRef>(null)

  /*
   * current active date of Calendar. the first visible day of day in
   * list will be active date
   */
  const [activeDate, setActiveDate] = useState<Date>(new Date())

  const handleDatePickerChange = (date: Date = new Date()) => {
    calendarRef.current!.jumpToDate(date)
  }

  const handleEventChange = (event: IEvent, type: string) => {
    calendarRef.current!.updateCrmEvents(event, type)
  }

  return (
    <Container>
      <Sidebar>
        <SideHeader>
          <Title>Calendar</Title>

          <TodayButton onClick={handleDatePickerChange} />
        </SideHeader>

        <DatePicker
          selectedDate={activeDate}
          onChange={handleDatePickerChange}
        />
      </Sidebar>

      <Main>
        <Header>
          <Filters />
          <CreateEvent onEventChange={handleEventChange} />
        </Header>

        <List
          ref={calendarRef}
          onChangeActiveDate={debounce(setActiveDate, 100)}
        />
      </Main>
    </Container>
  )
}

export default CalendarPage
