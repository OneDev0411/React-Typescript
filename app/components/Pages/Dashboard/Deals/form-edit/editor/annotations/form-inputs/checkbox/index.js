import React from 'react'
import cn from 'classnames'
import styled from 'styled-components'


import parseAppearanceString from '../../../../utils/appearance'

export default function CheckboxAnnotation(props) {
  const { annotation, value } = props
  const appearance = parseAppearanceString(annotation.defaultAppearance)

  const { rect } = annotation

  const box = {
    left: rect[0],
    top: rect[1],
    width: Math.floor(rect[2] - rect[0]),
    height: Math.floor(rect[3] - rect[1])
  }

  const CheckboxInput = styled.input`
    color: ${appearance.color};
    font-weight: ${appearance.bold ? 'bold' : 'normal'};
    font-face: ${appearance.fontFace};
    position: absolute;
    text-align: center;
    left: ${box.left}px;
    top: ${box.top}px;
    width: ${box.width}px;
    height: ${box.height}px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: 1px solid black;
    background-color: #d2e5f2;
    border: 1px solid #cccd;

    :hover {
      cursor: pointer;
    }

    :checked {
      :before {
        content: 'X';
      }
    }`

  return (
    <CheckboxInput
      id={annotation.fieldName}
      type="checkbox"
      key={annotation.fieldName}
      onChange={e => props.onValueUpdate(e.target.checked)}
      defaultChecked={Boolean(value)}
    />
  )
}
