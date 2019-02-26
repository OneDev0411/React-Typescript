import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  top: ${props => props.position.top + 20}px;
  left: ${props => props.position.left}px;
  width: ${props => props.position.width}px;
  min-height: 80px;
  background-color: #fff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  padding: 10px;
`
