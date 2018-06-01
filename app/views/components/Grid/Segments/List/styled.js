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
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ListItemCount = styled.div`
  width: 20%;
  text-align: right;
`

export const ListItem = styled.div`
  display: flex;
  margin-bottom: 15px;
  font-size: 14px;
  cursor: pointer;

  color: ${props => (props.isSelected ? '#2196f3' : '#17283a')};
  font-weight: ${props => (props.isSelected ? 600 : 'normal')};

  ${ListItemCount} {
    color: ${props => (props.isSelected ? '#2196f3' : '#5a7390')};
  }
`
