import styled from 'styled-components'

export const CheckboxInput = styled.input`
  color: ${props => props.appearance.color};
  font-weight: ${props => (props.appearance.bold ? 'bold' : 'normal')};
  font-family: ${props => props.appearance.fontFace};
  font-size: ${props => props.box.height}px;
  position: absolute;
  text-align: center;
  left: ${props => props.box.left}px;
  top: ${props => props.box.top}px;
  width: ${props => props.box.width}px;
  height: ${props => props.box.height}px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #d2e5f2;
  cursor: pointer;
  margin: 0 !important;
  padding: 0;
  outline: 0 !important;

  :checked {
    :before {
      position: absolute;
      content: '╳';
      font-weight: bold;
      font-size: ${props => props.box.height}px;
      width: 100%;
      height: 100%;
      display: block;
      text-align: center;
    }
  }

  :hover {
    transition: transform 0.1s ease-out;
    transform: scale(2.5);
  }
`
