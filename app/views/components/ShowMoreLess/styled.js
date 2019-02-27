import styled from 'styled-components'

import { blue } from 'views/utils/colors'
import Arrow from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const ShowMoreLessText = styled.div`
  display: flex;
  color: ${blue.A100};
  font-weight: 400;
  cursor: pointer;
  margin-top: 0.5rem;
`

export const ArrowDown = styled(Arrow)`
  fill: ${blue.A100};
`

export const ArrowUp = styled(ArrowDown)`
  transform: rotate(180deg);
`
