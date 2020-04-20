import { Theme } from '@material-ui/core'
import styled, { ThemeProps } from 'styled-components'

import { CSSProperties } from 'react'

import IconButton from '../../Button/IconButton'

interface ContainerProps {
  isOpen?: boolean
  width?: CSSProperties['width']
}

interface ItemListProps {
  isSelected?: boolean
}

export const Container = styled.div<ContainerProps>`
  width: ${props => (props.isOpen ? props.width : '0')};
  height: 100vh;
  overflow-x: hidden;
  padding: ${props => (props.isOpen ? '2rem 1em 1em' : '2rem 0 1em')};
  background-color: #f2f2f2;
  transition: width 0.1s linear, padding 0.1s linear 0.05s;
`

export const ListTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 21px;
  margin-bottom: 1.5rem;
  font-weight: 500;
`

export const DeleteButton = styled(IconButton)`
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s linear;
`

export const ListItem = styled.div<ItemListProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5em;

  color: ${props =>
    props.isSelected ? props.theme.palette.primary.main : '#000'};
  font-weight: ${props => (props.isSelected ? 500 : 400)};
  cursor: ${props => (props.isSelected ? 'initial' : 'pointer')};

  &:hover {
    color: ${(props: ThemeProps<Theme>) => props.theme.palette.primary.main};

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
