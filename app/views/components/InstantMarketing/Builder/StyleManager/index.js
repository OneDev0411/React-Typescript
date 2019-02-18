import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

import { Container } from './styled'
import ColorPicker from './ColorPicker'
import FontSizePicker from './FontSizePicker'
import loadGrapes from '../../helpers/load-grapes'

export const load = async () => {
  const { Grapesjs } = await loadGrapes()

  Grapesjs.plugins.add('style-manager', (editor, options) => {
    let styleManagerContainer
    let colorPickerContainer
    let fontSizePickerContainer

    const {
      colorPicker: colorPickerOptions = {},
      fontSizePicker: fontSizePickerOptions = {}
    } = options

    const isElementAllowed = (element, conditions) => {
      if (!conditions.allowedTags.includes(element.tagName.toLowerCase())) {
        return false
      }

      const hasForbiddenStyle = conditions.forbiddenTagsWithStyle.some(
        forbiddenStyle => !element.style[forbiddenStyle]
      )

      return hasForbiddenStyle
    }

    editor.on('load', () => {
      const pn = editor.Panels
      const id = 'views-container'
      const panels = pn.getPanel(id) || pn.addPanel({ id })

      panels.set(
        'appendContent',
        ReactDOMServer.renderToString(
          <Container id="mc-editor-style-manager" />
        )
      )

      styleManagerContainer = panels.view.$el[0].querySelector(
        '#mc-editor-style-manager'
      )

      if (!fontSizePickerOptions.disabled) {
        fontSizePickerContainer = document.createElement('div')
        fontSizePickerContainer.id = 'mc-editor-font-size-picker'
        styleManagerContainer.appendChild(fontSizePickerContainer)
      }

      if (!colorPickerOptions.disabled) {
        colorPickerContainer = document.createElement('div')
        colorPickerContainer.id = 'mc-editor-color-picker'
        styleManagerContainer.appendChild(colorPickerContainer)
      }
    })

    editor.on('component:selected', selected => {
      if (!selected) {
        return
      }

      const selectedElement = selected.view.$el[0]

      if (!fontSizePickerOptions.disabled) {
        ReactDOM.unmountComponentAtNode(fontSizePickerContainer)

        if (
          isElementAllowed(selectedElement, fontSizePickerOptions.conditions)
        ) {
          ReactDOM.render(
            <FontSizePicker
              value={selectedElement.style.fontSize}
              onChange={size => (selectedElement.style.fontSize = size)}
            />,
            fontSizePickerContainer
          )
        }
      }

      if (!colorPickerOptions.disabled) {
        ReactDOM.unmountComponentAtNode(colorPickerContainer)

        if (
          isElementAllowed(selectedElement, fontSizePickerOptions.conditions)
        ) {
          ReactDOM.render(
            <ColorPicker
              color={selectedElement.style.color}
              onChange={color => (selectedElement.style.color = color.hex)}
            />,
            colorPickerContainer
          )
        }
      }
    })
  })
}
