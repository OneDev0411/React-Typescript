import styled, { css } from 'styled-components'

export interface ScrollableWrapperProps {
  /**
   * defaults to 5
   * */
  shadowHeight?: number
  /**
   * defaults to grey
   * */
  shadowColor?: 'white' | 'grey' | string
}

const colorToRbg: {
  [key in Required<ScrollableWrapperProps>['shadowColor']]: string
} = {
  grey: 'rgba(210, 210, 210, 1)',
  white: 'rgb(255,255,255)'
}

export const Wrapper = styled.div<ScrollableWrapperProps>`
  position: relative;
  min-height: 0; /*for usages inside flex items*/

  display: flex;
  flex-direction: column;

  &.has-bottom-shadow,
  &.has-top-shadow {
    &&::before,
    &::after {
      pointer-events: none;
      position: absolute;
      height: ${({ shadowHeight = 5 }) => `${shadowHeight}px`};
      width: 100%;
      z-index: 1;
    }
  }
  ${({ shadowColor = 'grey' }) => {
    const color = Object.keys(colorToRbg).includes(shadowColor)
      ? colorToRbg[shadowColor]
      : shadowColor

    return css`
      &.has-bottom-shadow {
        &::after {
          content: '';
          background: linear-gradient(0deg, ${color} 0%, rgba(0, 0, 0, 0) 100%);
          bottom: 0;
        }
      }
      &.has-top-shadow {
        &::before {
          content: '';
          background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, ${color} 100%);
          top: 0;
        }
      }
    `
  }}
`
export const Content = styled.div`
  overflow: auto;
  overflow: overlay;
  overflow-x: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`
