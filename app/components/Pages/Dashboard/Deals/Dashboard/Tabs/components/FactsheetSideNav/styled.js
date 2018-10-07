import styled from 'styled-components'
import AbstractCard from 'components/Card'

import { borderColor } from 'views/utils/colors'

export const Card = styled(AbstractCard)`
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px ${borderColor};
  box-shadow: none;
`
