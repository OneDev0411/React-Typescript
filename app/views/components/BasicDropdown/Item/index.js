import styled from 'styled-components'

import { blue, grey } from 'views/utils/colors'

export const Item = styled.div`
  cursor: pointer;
  line-height: 24px;
  padding: 8px 16px;
  white-space: nowrap;
  font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'normal')};
  color: ${({ isSelected, isActive }) =>
    isSelected || isActive ? '#fff' : '#000'};
  background-color: ${({ isActive, isSelected }) =>
    isActive || isSelected ? blue.A100 : '#fff'};

  &:hover,
  &:focus {
    border-color: ${grey.A300};
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
  }
`
