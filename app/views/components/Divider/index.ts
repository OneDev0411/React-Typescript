import styled, { css } from 'styled-components'

import { CSSProperties } from 'react'

import { borderColor, grey } from 'views/utils/colors'

interface Props {
  vertical?: boolean
  /**
   * A centered text to be included on the divider. Like common "Or" dividers
   */
  text?: string
  width?: CSSProperties['width']
  height?: CSSProperties['width']
  margin?: CSSProperties['margin']
}

export const Divider = styled.div<Props>`
  width: ${({ width, vertical }) => width || (vertical ? '1px' : '100%')};
  height: ${({ height, vertical }) => height || (vertical ? '100%' : '1px')};
  margin: ${props => (props.margin ? props.margin : 0)};
  background-color: ${borderColor};
  position: relative;
  ${(props: Props) =>
    props.text &&
    css`
      ::after {
        content: "${props.text}";
        position: absolute;
        left: 50%;
        top: -50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 0 0.56rem;
        font-size: 0.75rem;
        color: ${grey.A500}
      }
    `}
`
