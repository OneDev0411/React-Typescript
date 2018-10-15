import styled, { css } from 'styled-components'

const styles = css`
position: absolute;
  left: ${props => props.rect[0]}px;
  top: ${props => props.rect[1]}px;
  width: ${props => Math.floor(props.rect[2] - props.rect[0])}px;
  height: ${props => Math.floor(props.rect[3] - props.rect[1])}px;

  font-size: ${props => props.fontSize || 16}px;
  font-family: ${props => props.appearance.font};
  color: ${props => props.appearance.color};
  font-weight: ${props => (props.appearance.bold ? 'bold' : 'normal')}
  min-width: 15px;
  background-color: #d2e5f2;
  border: 1px solid #ccc;
  transition: 0.1s ease-in all;
  padding: 0 3px;
  line-height: normal;
`

export const TextInput = styled.input`
  ${styles};
`

export const TextArea = styled.textarea`
  ${styles};
  resize: none;
`
