import styled from 'styled-components'

import { borderColor } from '../../utils/colors'

export const Divider = styled.div`
  width: ${props => (props.width ? props.width : '100%')};
  height: ${props => (props.height ? props.height : '1px')};
  margin-top: ${props => (props.marginTop ? props.marginTop : '1em')};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '1em')};
  background-color: ${borderColor};
`
