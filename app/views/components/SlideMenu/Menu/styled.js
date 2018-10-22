import styled from 'styled-components'

import { blue } from '../../../utils/colors'
import IconButton from '../../Button/IconButton'

export const Container = styled.div`
  width: ${props => (props.isOpen ? props.width : '0')};
  height: 100vh;
  overflow-x: hidden;
  padding: ${props => (props.isOpen ? '2.5rem 1em 1em' : '2.5rem 0 1em')};
  background-color: #f2f2f2;
  transition: width 0.1s linear, padding 0.1s linear 0.05s;
`

export const ListTitle = styled.div`
  font-size: 21px;
  margin-bottom: 1.5rem;
  font-weight: 500;
`

export const DeleteButton = IconButton.extend`
  opacity: 0;
  visibility: hidden;
  transition: all 0.3 linear;
`

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5em;

  color: ${props => (props.isSelected ? blue.A100 : '#000')};
  font-weight: ${props => (props.isSelected ? 500 : 400)};
  cursor: ${props => (props.isSelected ? 'initial' : 'pointer')};

  &:hover {
    color: ${blue.A100};

    ${DeleteButton} {
      opacity: 1;
      visibility: visible;
    }
  }
`

export const ListItemName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 0.5em;
`
