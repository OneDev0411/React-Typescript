import styled from 'styled-components'

export const Container = styled.div`
  font-size: ${props => props.fontSize};
  font-family: ${props => props.fontName};
  color: ${props => props.color};
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
  position: absolute;
  left: ${props => props.rect.left}px;
  top: ${props => props.rect.top}px;
  width: ${props => props.rect.width}px;
  height: ${props => props.rect.height}px;
  background-color: ${props => (props.readOnly ? 'transparent' : '#d2e5f2')};
  cursor: ${props => (props.readOnly ? 'auto' : 'pointer')};

  :hover {
    opacity: ${props => (props.readOnly ? 1 : 0.8)};
  }
`
