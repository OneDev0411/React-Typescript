// import styled from 'styled-components'
import 'react-day-picker/lib/style.css'

import ActionButton from '../Button/ActionButton'
import styled from 'styled-components'

export const Container = styled.div`
  .DayPicker-wrapper:focus,
  .DayPicker-Day:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  .DayPicker-Day--selected {
    background-color: #2196f3 !important;
    border-radius: 0 !important;
  }

  .DayPicker-Day--range {
    background-color: #dbdbdb;
    color: white;
  }

  .DayPicker-Day--range:hover {
    background-color: #dbdbdb !important;
    color: #262626 !important;
    border-radius: 0 !important;
  }
`

export const TodayButton = ActionButton.extend`
  background-color: transparent;
  width: 100%;
`
