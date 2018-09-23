import styled from 'styled-components'

export const RadioInput = styled.input`
  color: ${props => props.appearance.color};
  font-weight: ${props => (props.appearance.bold ? 'bold' : 'normal')};
  font-face: ${props => props.appearance.fontFace};
  position: absolute;
  text-align: center;
  left: ${props => props.box.left}px;
  top: ${props => props.box.top}px;
  width: ${props => props.box.width}px;
  height: ${props => props.box.height}px;
  appearance: none;
  background-color: #d2e5f2;
  border: 1px solid #cccd;
  border-radius: 4px;
  cursor: pointer;

  :checked {
    :before {
      content: '✔';
    }
  }

  :focus {
    outline: none;
  }
`
