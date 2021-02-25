import styled, { createGlobalStyle, css } from 'styled-components'

import IconButton from '../Button/IconButton'

const buttonVisibilityStyle = css`
  opacity: 1;
  transform: translateY(0);
`

export const Button = styled(IconButton)`
  position: fixed;
  left: 0.5rem;
  bottom: 0.5em;
  width: 48px;
  height: 48px;
  z-index: 1004;
  border-radius: 100%;
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
