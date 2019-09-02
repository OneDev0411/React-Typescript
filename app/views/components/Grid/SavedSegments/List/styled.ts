import styled from 'styled-components'

import { blue, primary } from '../../../../utils/colors'
import IconButton from '../../../Button/IconButton'

export const Container = styled.div`
  padding: 1rem;
`

export const ListTitle = styled.div<{ isSelected?: boolean }>`
  font-weight: 500;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  color: ${props => (props.isSelected ? blue.A100 : '#000')};
  cursor: ${props => (props.isSelected ? 'initial' : 'pointer')};

  svg {
    width: 1rem;
    height: 1rem;
    &:hover {
      fill: ${primary};
    }
  }
`

export const ListItemName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 0.5em;
`

export const DeleteButton = styled(IconButton)`
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s linear;
`

export const ListItem = styled.div<{ isSelected?: boolean }>`
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

  &:last-child {
    margin-bottom: 0;
  }
`
