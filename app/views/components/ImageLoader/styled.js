import styled, { keyframes } from 'styled-components'

const blinker = keyframes`
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
`

export const Placeholder = styled.div`
  display: inline-block;
  color: #fff;
  font-size: 20px;
  border-radius: 3px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: ${props => props.width};
  height: ${props => props.height};
  line-height: ${props => props.height}px;
  animation: ${blinker} 1.7s ease infinite;
  background-color: #bcd3e0;
  background: linear-gradient(270deg, #eee, #bcd3e0);
  background-size: 400% 400%;
`
