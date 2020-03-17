import styled, { createGlobalStyle, css } from 'styled-components'

import IconButton from '../Button/IconButton'

const buttonVisibilityStyle = css`
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
  pointer-events: unset;
`

export const Button = styled(IconButton)`
  width: 48px;
  height: 48px;
  position: fixed;
  left: 0.5rem;
  bottom: 0.5em;
  z-index: 3860017101;
  border-radius: 100%;
  visibility: hidden;
  pointer-events: none;
  opacity: 0;
  transform: translateY(1rem);
  transition: all 0.5s;

  ${props => props.isActive && buttonVisibilityStyle}
`

export const GlobalIntercomStyles = createGlobalStyle`
  .intercom-messenger-frame{

    left: 0.5rem !important;
    bottom: 4.25rem !important;
  }
`
