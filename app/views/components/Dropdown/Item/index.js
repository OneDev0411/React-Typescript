import styled, { css } from 'styled-components'

import { primary } from '../../../../views/utils/colors'

const getStatesStyle = props => {
  const { isActive, isSelected } = props

  if (isActive) {
    return css`
      color: #fff;
      background-color: ${primary};
    `
  } else if (isSelected) {
    return css`
      font-weight: 500;
      color: ${primary};
    `
  }
}

export const Item = styled.div`
  width: '100%';
  display: flex;
  align-items: center;
  padding: 0.5em 1em;
  cursor: pointer;
  white-space: nowrap;
  ${props => getStatesStyle(props)};
  font-weight: ${({ isSelected }) => (isSelected ? 500 : 400)};

  &:hover,
  &:focus {
    color: #fff;
    background-color: ${primary};

    > svg {
      fill: #fff;
    }
  }

  ${props =>
    props.item.icon && props.item.iconColor
      ? css`
          > svg {
            margin-right: 0.5em;
            fill: ${props.item.iconColor};
          }
        `
      : ''};
`
