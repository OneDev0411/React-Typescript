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
  height?: CSSProperties['height']
  margin?: CSSProperties['margin']
  color?: CSSProperties['backgroundColor']
}

const getHeight = ({ height, vertical }: Props) =>
  height || (vertical ? '100%' : '1px')

const getWidth = ({ width, vertical }: Props) =>
  width || (vertical ? '1px' : '100%')
export const Divider = styled.div<Props>`
  width: ${getWidth};
  min-width: ${getWidth};
  height: ${getHeight};
  min-height: ${getHeight};
  margin: ${props => (props.margin ? props.margin : 0)};
  background-color: ${props => (props.color ? props.color : borderColor)};
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
