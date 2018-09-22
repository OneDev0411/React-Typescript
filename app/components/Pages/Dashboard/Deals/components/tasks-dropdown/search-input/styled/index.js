import styled from 'styled-components'
import { primary } from 'views/utils/colors'
import ActionButton from 'components/Button/ActionButton'

export const SearchContainer = ActionButton.extend`
  &:hover > svg {
    fill: ${primary};
  }
`

export const Input = styled.input`
  width: 95%;
  border: none;
  cursor: pointer;
  background-color: transparent;
  text-overflow: ellipsis;

  :focus {
    outline: none;
  }
`

export const Title = styled.div`
  width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => (props.hasTask ? '#000' : 'gray')};
`
