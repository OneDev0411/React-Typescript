import { css } from 'styled-components'
import Chromath from 'chromath'

import { grey, primary, primaryDark } from '../../../utils/colors'

export const buttonBaseStyle = css`
  width: ${props => (props.isBlock ? '100%' : 'auto')};

  cursor: pointer;
  -webkit-appearance: none;
  -webkit-font-smoothing: antialiased;

  border: none;
  outline: none;
  border-radius: 3px;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: ${props => (props.isBlock ? 'center' : 'initial')};
  flex-wrap: nowrap;
  vertical-align: middle;
  margin: 0;

  font-family: Barlow;
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
`

const isNotDisableState = '&:not([disabled]):'

export const ButtonAppearances = {
  primary: css`
    ${buttonBaseStyle};
    color: #fff;
    font-weight: 500;
    background-color: ${props => props.brandColor || primary};

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
  `,
  outline: css`
    ${buttonBaseStyle};
    font-weight: 500;
    border-style: solid;
    border-color: ${props => (props.isOpen ? primary : '#000')};
    border-width: ${props => (props.noBorder ? 0 : '1px')};
    color: ${props => (props.isOpen ? primary : '#000')};
    background-color: ${props => (props.isActive ? grey.A100 : 'transparent')};

    &[disabled] {
      border-color: ${grey.A550};

      svg {
        fill: ${grey.A550};
      }
    }

    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: ${props => props.brandColor || primary};
      border-color: ${props => props.brandColor || primary};
      text-decoration: none;

      svg {
        fill: ${props => props.brandColor || primary};
      }
    }

    svg {
      fill: ${props => (props.isOpen ? primary : '#000')};
    }
  `,
  link: css`
    ${buttonBaseStyle};
    color: ${props => (props.inverse ? '#000' : props.brandColor || primary)};
    background-color: transparent;

    &[disabled] {
      text-decoration: none;
    }

    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: ${props =>
        props.brandColor
          ? Chromath.towards(props.brandColor, 'black', 0.25).toString()
          : primaryDark};
      text-decoration: none;

      svg {
        fill: ${props =>
          props.brandColor
            ? Chromath.towards(props.brandColor, 'black', 0.25).toString()
            : primaryDark};
      }
    }

    svg {
      fill: ${props => (props.inverse ? '#000' : props.brandColor || primary)};
    }
  `,
  icon: css`
    ${buttonBaseStyle};
    background-color: transparent;

    svg {
      fill: ${grey.A900};
    }
  `
}
