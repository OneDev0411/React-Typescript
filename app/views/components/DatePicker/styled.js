// import styled from 'styled-components'
import 'react-day-picker/lib/style.css'

import { primary, grey } from '../../utils/colors'
import styled from 'styled-components'

export const Container = styled.div`
  .DayPicker {
    padding: 0 !important;
  }

  .DayPicker-Month {
    margin: 0 !important;
  }

  .DayPicker-Week {
    display: table-row;
    height: 27px !important;
  }

  .DayPicker-Day {
    padding: 0 !important;
    width: 32px !important;
    height: 32px !important;
  }

  .DayPicker-wrapper:focus,
  .DayPicker-Day:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  .DayPicker-Day--selected {
    background-color: #000000 !important;
  }

  .DayPicker-Day--range {
    background-color: ${grey.A400};
    color: #fff;
  }

  .DayPicker-Day--range:hover {
    color: #fff !important;
    border-radius: 0 !important;
    background-color: ${grey.A500} !important;
  }

  .DayPicker .DayPicker-Day--outside:hover {
    background-color: transparent !important;
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    color: #fff !important;
    background-color: ${primary} !important;
  }
`
