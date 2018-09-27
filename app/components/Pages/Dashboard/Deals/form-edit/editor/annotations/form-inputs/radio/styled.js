import styled from 'styled-components'

export const RadioInput = styled.input`
  color: ${props => props.appearance.color};
  font-weight: ${props => (props.appearance.bold ? 'bold' : 'normal')};
  font-family: ${props => props.appearance.fontFace};
  font-size: ${props => props.box.height}px;
  position: absolute;
  text-align: center;
  left: ${props => props.box.left}px;
  top: ${props => props.box.top}px;
  width: ${props => props.box.width}px !important;
  height: ${props => props.box.height}px !important;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #d2e5f2;
  cursor: pointer;

  margin: 0 !important;
  background-image: none !important;

  :checked {
    :before {
      content: '❌';
    }
  }

  :hover {
    transform: scale(2);
  }
`
