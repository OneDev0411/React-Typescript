import styled from 'styled-components'
import { blue } from '../../../../utils/colors'

export const Container = styled.div`
  padding: 12px 16px;
`

export const ListTitle = styled.div`
  font-size: 21px;
  line-height: 24px;
  margin-bottom: 24px;
  font-weight: 500;
`

export const ListItemName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ListIconContainer = styled.div``

export const Icon = styled.i`
  display: none;
  color: #ccc;
`

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 16px;
  line-height: 24px;
  justify-content: space-between;

  color: ${props => (props.isSelected ? blue.A100 : '#000')};
  font-weight: ${props => (props.isSelected ? 500 : 'normal')};
  opacity: ${props => (props.isDeleting ? 0.3 : 1)};
  cursor: ${props => (props.isSelected ? 'normal' : 'pointer')};

  :hover ${Icon} {
    display: block;
  }
`
