import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  width: 136px;
  height: 32px;
  line-height: 32px;
  vertical-align: middle;
  margin-bottom: 5px;
`
export const List = styled.div`
  position: absolute;
  width: 170px;
  min-height: 32px;
  max-height: 300px;
  overflow: auto;
  border-radius: 6px;
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  z-index: 1000;
`

export const ListItem = styled.div`
  height: 32px;
  line-height: 32px;
  vertical-align: middle;
  padding: 0 16px;
  color: #262626;
  cursor: pointer;
  font-size: 16px;

  :hover {
    background-color: #2196f3;
    color: #fff;
  }
`

export const AddItem = styled.div`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: #2196f3;
  opacity: ${props => (props.disabled ? 0.7 : 1)};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    color: ${props => (props.disabled ? '#2196f3' : '#186cb0')};
  }
`
