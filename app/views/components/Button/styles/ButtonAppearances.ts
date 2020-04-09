import { css } from 'styled-components'
import Chromath from 'chromath'

import { ActionButtonProps } from 'components/Button/ActionButton'

import {
  grey,
  red,
  primary,
  primaryDark,
  secondary,
  secondaryDark
} from '../../../utils/colors'

function checkRoundedDirection(props) {
  if (props.rightRounded) {
    return css`
      border-radius: 0 3px 3px 0;
    `
  }

  if (props.leftRounded) {
    return css`
      border-radius: 3px 0 0 3px;
    `
  }
}

export const buttonBaseStyle = css<ActionButtonProps>`
  width: ${props => (props.isBlock ? '100%' : 'auto')};
  cursor: pointer;
  -webkit-appearance: none;
  -webkit-font-smoothing: antialiased;
  border: none;
  outline: none;
  border-radius: 4px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: ${props => (props.isBlock ? 'center' : 'initial')};
  flex-wrap: nowrap;
  vertical-align: middle;
  margin: 0;
  font-family: LatoRegular;
  font-weight: normal;
  text-decoration: none;
  white-space: nowrap;
  &::-moz-focus-inner {
    border: 0;
  }
  &[disabled] {
    color: ${grey.A900};
    cursor: initial;
    svg {
      fill: ${grey.A900};
    }
  }
  ${checkRoundedDirection}
`
const isNotDisableState = '&:not([disabled]):'
const primaryStyle = css<ActionButtonProps>`
  ${buttonBaseStyle};
  color: #fff;
  font-weight: 500;
  background-color: ${props => props.brandColor || primary};
  svg {
    fill: #fff;
  }
  &[disabled] {
    background-color: ${grey.A550};
  }
  ${isNotDisableState}hover, ${isNotDisableState}focus {
    color: #fff;
    text-decoration: none;
    background-color: ${props =>
      props.brandColor
        ? Chromath.towards(props.brandColor, 'black', 0.25).toString()
        : primaryDark};
  }
`
export const ButtonAppearances = {
  primary: primaryStyle,
  secondary: css<ActionButtonProps>`
    ${buttonBaseStyle};
    ${primaryStyle};
    background-color: ${secondary};
    ${isNotDisableState}hover, ${isNotDisableState}focus {
      background-color: ${secondaryDark};
    }
  `,
  outline: css<ActionButtonProps>`
    ${buttonBaseStyle};
    font-weight: 500;
    border-style: solid;
    border-color: ${props => (props.isOpen ? primary : '#000')};
    border-width: ${props => (props.noBorder ? 0 : '1px')};
    color: ${props => (props.isOpen ? primary : '#000')};
    background-color: ${props => (props.isActive ? grey.A100 : 'transparent')};
    &.ghost,
    &[disabled] {
      color: ${grey.A550};
      border-color: ${grey.A550};
      svg {
        fill: ${grey.A550};
      }
    }
    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: ${props => props.brandColor || props.theme.palette.secondary.main};
      border-color: ${props =>
        props.brandColor || props.theme.palette.secondary.main};
      text-decoration: none;
      svg {
        fill: ${props =>
          props.brandColor || props.theme.palette.secondary.main};
      }
    }
    &.danger:not([disabled]) {
      color: ${red.primary};
      border-color: ${red.primary};
      &:hover,
      &:focus {
        color: ${red.dark};
        border-color: ${red.dark};
        background-color: rgba(244, 59, 56, 0.05);
      }
    }
    svg {
      fill: ${props => (props.isOpen ? primary : '#000')};
    }
  `,
  flat: css<ActionButtonProps>`
    ${buttonBaseStyle};
    font-weight: 500;
    color: ${props => (props.isOpen ? primary : '#000')};
    background-color: ${props => (props.isActive ? grey.A200 : grey.A150)};
    &[disabled] {
      svg {
        fill: ${grey.A550};
      }
    }
    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: ${props => props.brandColor || primary};
      text-decoration: none;
      svg {
        fill: ${props => props.brandColor || primary};
      }
    }
    svg {
      fill: ${props => (props.isOpen ? primary : '#000')};
    }
  `,
  link: css<ActionButtonProps>`
    ${buttonBaseStyle};
    color: ${props =>
      props.inverse
        ? '#000'
        : props.brandColor || props.theme.palette.secondary.main};
    background-color: transparent;
    &[disabled] {
      text-decoration: none;
    }
    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: ${props =>
        props.brandColor
          ? Chromath.towards(props.brandColor, 'black', 0.25).toString()
          : props.theme.palette.secondary.dark};
      text-decoration: none;
      svg {
        fill: ${props =>
          props.brandColor
            ? Chromath.towards(props.brandColor, 'black', 0.25).toString()
            : props.theme.palette.secondary.dark};
      }
    }
    svg {
      fill: ${props =>
        !props.inverse || props.isActive
          ? props.brandColor || props.theme.palette.secondary.main
          : '#000'};
    }
  `,
  icon: css<ActionButtonProps>`
    ${buttonBaseStyle};
    background-color: transparent;
    svg {
      fill: ${grey.A900};
    }
  `
}
