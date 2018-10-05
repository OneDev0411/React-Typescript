import styled from 'styled-components'
import AbstractCard from 'components/Card'

import { borderColor } from 'views/utils/colors'

export const FactsheetDivider = styled.div`
  width: 3.3rem;
  height: 1px;
  margin: 1.5rem;
  background-color: ${borderColor};
`

export const Card = styled(AbstractCard)`
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px ${borderColor};
  box-shadow: none;
`
