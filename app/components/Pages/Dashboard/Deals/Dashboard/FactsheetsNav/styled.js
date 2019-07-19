import styled from 'styled-components'

import BaseCard from 'components/Card'
import { borderColor } from 'views/utils/colors'

export const Card = styled(BaseCard)`
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px ${borderColor};
  box-shadow: none;
  padding: 1.5rem 0;
  margin-bottom: 1rem;
  overflow: auto;
  overflow-x: hidden;
`
