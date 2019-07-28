import React, { useState } from 'react'
import debounce from 'lodash/debounce'

import List from 'components/Calendar'
import DatePicker from 'components/DatePicker'

import { TodayButton } from './components/TodayButton'
import { Filters } from './components/Filters'
import { CreateEvent } from './components/CreateEvent'

import { Container, Sidebar, Header, Main, SideHeader, Title } from './styled'

const CalendarPage: React.FC = props => {
  /*
   * current active date of Calendar. the first visible day of day in
   * list will be active date
   */
  const [activeDate, setActiveDate] = useState<Date>(new Date())

  const handleDatePickerChange = (date: Date) => {
    console.log(date)
  }

  return (
    <Container>
      <Sidebar>
        <SideHeader>
          <Title>Calendar</Title>

          <TodayButton onClick={() => handleDatePickerChange(new Date())} />
        </SideHeader>

        <DatePicker
          selectedDate={activeDate}
          onChange={handleDatePickerChange}
        />
      </Sidebar>

      <Main>
        <Header>
          <Filters />
          <CreateEvent />
        </Header>

        <List onChangeActiveDate={debounce(setActiveDate, 100)} />
      </Main>
    </Container>
  )
}

export default CalendarPage
