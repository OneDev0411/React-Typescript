import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  min-height: 0; /*for usages inside flex items*/

  &.has-bottom-shadow,
  &.has-top-shadow {
    &&::before,
    &::after {
      pointer-events: none;
      position: absolute;
      height: 5px;
      width: 100%;
      z-index: 1;
    }
  }
  &.has-bottom-shadow {
    &::after {
      content: '';
      background: linear-gradient(
        0deg,
        rgba(210, 210, 210, 1) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      bottom: 0;
    }
  }
  &.has-top-shadow {
    &::before {
      content: '';
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(210, 210, 210, 1) 100%
      );
      top: 0;
    }
  }
`
export const Content = styled.div`
  overflow: auto;
  overflow: overlay;
  overflow-x: hidden;
  height: 100%;
`
