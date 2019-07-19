import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  top: ${props => props.position.top + 20}px;
  left: ${props => props.position.left}px;
  width: ${props => props.position.width}px;
  z-index: 1;
  min-height: 80px;
  background-color: #fff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.15),
    0 8px 10px 0 rgba(0, 0, 0, 0.16);
`
