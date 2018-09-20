import styled from 'styled-components'

import { grey } from '../../utils/colors'

export const Container = styled.div`
  .react-time-picker__button {
    border: none;
    border: none;
    padding: 0.25em;
    border-radius: 3px;
    background-color: ${grey.A100};
  }

  .react-time-picker__button__input__amPm {
    text-transform: uppercase;
    margin-left: 0.25em;
  }
`
