import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  top: ${props => props.position.top + 20}px;
  left: ${props => props.position.left}px;
  width: 250px;
  height: 100px;
  background-color: #f5f5f5;
  border: 1px solid green;
  border-radius: 5px;
  padding: 10px;
`
