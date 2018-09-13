import styled from 'styled-components'

import { primary, borderColor } from '../../../../views/utils/colors'

export const Item = styled.div`
  cursor: pointer;
  padding: 0.5em 1em;
  white-space: nowrap;
  font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'normal')};
  color: ${({ isActive, isSelected }) =>
    isActive || isSelected ? '#fff' : '#000'};
  background-color: ${({ isActive, isSelected }) =>
    isActive || isSelected ? primary : '#fff'};

  &:hover,
  &:focus {
    border-color: ${borderColor};
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
  }
`
