// import styled from 'styled-components'
import 'react-day-picker/lib/style.css'

import styled from 'styled-components'

import { primary, grey } from '../../utils/colors'

export const Container = styled.div`
  text-align: center;
  .DayPicker {
    padding: 0 !important;
  }

  .DayPicker-Month {
    margin: 0 !important;
    border-collapse: separate;
    border-spacing: 0.2rem;
  }

  .DayPicker-Week {
    display: table-row;
    height: 27px !important;
  }

  .DayPicker-Day {
    padding: 0 !important;
    width: 40px !important;
    height: 40px !important;
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

  .DayPicker-Caption {
    padding: 0 0 !important;
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
    background-color: ${primary};
  }
`
