import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const List = styled.div`
  position: absolute;
  z-index: 5;
  top: 100%;
  left: 0
  width: 15.5rem;
  max-height: 15.5rem;
  overflow-y: auto;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  min-width: 12rem;
`

export const ListItem = styled.div`
  display: block;
  font-size: 1rem;
  font-weight: ${props => (props.isSelected ? '500' : 'normal')};
  background-color: ${props => (props.isActive ? primary : '#fff')};
  color: ${props => (props.isActive ? '#fff' : primary)};
  text-transform: none;
  white-space: normal;
  word-wrap: normal;
  cursor: pointer;
  padding: 0.5rem;
`

export const Hint = styled(List)`
  display: flex;
  align-items: center;
  width: max-content;
  padding: 0 0.5rem;
  border-radius: 3px;
  opacity: 0;
  transition: 0.1s ease-in opacity;
  font-size: 0.875rem;
  height: 2rem;
`

export const Container = styled.div`
  :focus-within {
    ${Hint} {
      opacity: 1;
    }
  }
`
