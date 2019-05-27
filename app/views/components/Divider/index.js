import styled from 'styled-components'

import { borderColor } from '../../utils/colors'

export const Divider = styled.div`
  width: ${({ width, vertical }) => width || (vertical ? '1px' : '100%')};
  height: ${({ height, vertical }) => height || (vertical ? '100%' : '1px')};
  margin: ${props => (props.margin ? props.margin : 0)};
  background-color: ${borderColor};
`
