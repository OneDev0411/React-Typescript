import styled, { css } from 'styled-components'

import { PickerContainer } from 'components/DateTimePicker/styled'

export const DatePickerContainer = styled(PickerContainer)`
  ${({ theme }) => css`
    padding: 0;
    box-shadow: none;
    margin-bottom: ${theme.spacing(1)};

    .DayPicker-Caption {
      margin: 1% auto;
    }
  `}
`
