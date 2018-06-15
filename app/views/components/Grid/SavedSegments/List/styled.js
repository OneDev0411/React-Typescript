import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px 16px;
`

export const ListTitle = styled.div`
  font-size: 18px;
  color: #17283a;
  margin-bottom: 32px;
  font-weight: 500;
`

export const ListItemName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 95%;
`

export const ListIconContainer = styled.div`
  width: 5%;
`

export const Icon = styled.i`
  display: none;
  color: #ccc;
`

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 15px;
  cursor: pointer;

  color: ${props => (props.isSelected ? '#2196f3' : '#17283a')};
  font-weight: ${props => (props.isSelected ? 600 : 'normal')};
  opacity: ${props => (props.isDeleting ? 0.3 : 1)};

  :hover ${Icon} {
    display: block;
  }
`
