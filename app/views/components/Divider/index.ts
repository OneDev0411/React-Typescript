import styled from 'styled-components'

import { CSSProperties } from 'react'

import { borderColor } from '../../utils/colors'

interface Props {
  width?: CSSProperties['width']
  height?: CSSProperties['width']
  margin?: CSSProperties['margin']
}

export const Divider = styled.div<Props>`
  width: ${({ width, vertical }) => width || (vertical ? '1px' : '100%')};
  height: ${({ height, vertical }) => height || (vertical ? '100%' : '1px')};
  margin: ${props => (props.margin ? props.margin : 0)};
  background-color: ${borderColor};
`
