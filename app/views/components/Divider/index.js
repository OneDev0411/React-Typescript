import styled from 'styled-components'

import { borderColor } from '../../utils/colors'

export const Divider = styled.div`
  width: ${props => (props.width ? props.width : '100%')};
  height: ${props => (props.height ? props.height : '1px')};
  margin: ${props => (props.margin ? props.margin : 0)};
  background-color: ${borderColor};
`
