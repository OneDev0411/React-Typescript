import React from 'react'
import styled from 'styled-components'
import parseAppearanceString from '../../../../utils/appearance'

const TextInput = styled.input`
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

  :focus {
    background-color: transparent;
    outline: none;
    border: none;
    font-size: ${props => (props.fontSize || 16) - 2}px;
    font-weight: 400;
    color: #262626;
  }
`

class TextAnnotation extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value
  }

  onChange = e => this.props.onValueUpdate(e.target.value)

  render() {
    const appearance = parseAppearanceString(
      this.props.annotation.defaultAppearance
    )

    return (
      <TextInput
        id={this.props.annotation.fieldName}
        appearance={appearance}
        fontSize={this.props.fontSize}
        rect={this.props.annotation.rect}
        onInput={this.onChange}
        defaultValue={this.props.value || ''}
      />
    )
  }
}

export default TextAnnotation
