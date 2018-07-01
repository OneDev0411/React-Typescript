import styled from 'styled-components'

export const Item = styled.div`
  cursor: pointer;
  line-height: 1em;
  padding: 0.5em 1em;
  white-space: nowrap;
  font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'normal')};
  color: ${({ isSelected }) => (isSelected ? '#2196f3' : '#17283a')};
  background-color: ${({ isActive }) => (isActive ? 'lightgrey' : 'white')};

  &:hover,
  &:focus {
    border-color: #96c8da;
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
  }
`
