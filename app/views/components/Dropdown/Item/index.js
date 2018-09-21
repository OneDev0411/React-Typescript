import styled, { css } from 'styled-components'

import { primary } from '../../../../views/utils/colors'

export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 1em;
  cursor: pointer;
  white-space: nowrap;
  color: ${props => (props.isActive ? '#fff' : '#000')};
  background-color: ${props => (props.isActive ? primary : '#fff')};
  font-weight: ${props => (props.isSelected && !props.isActive ? 700 : 400)};

  &:hover,
  &:focus {
    color: #fff;
    background-color: ${primary};

    > svg {
      fill: #fff;
    }
  }

  ${props =>
    props.item && props.item.icon && props.item.iconColor
      ? css`
          > svg {
            margin-right: 0.5em;
            fill: ${props.item.iconColor};
          }
        `
      : ''};
`
