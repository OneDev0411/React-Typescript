import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

import { Container } from './styled'
import FontSizePicker from './FontSizePicker'
import FontWeightPicker from './FontWeightPicker'
import ColorPicker from './ColorPicker'
import TextAlignPicker from './TextAlignPicker'
import { loadGrapesjs } from '../utils/load-grapes'

export const load = async colors => {
  const { Grapesjs } = await loadGrapesjs()

  Grapesjs.plugins.add('style-manager', (editor, options) => {
    let styleManagerContainer
    let fontSizePickerContainer
    let fontWeightPickerContainer
    let textAlignPickerContainer
    let colorPickerContainer
    let backgroundColorPickerContainer

    const {
      fontSizePicker: fontSizePickerOptions = {},
      fontWeightPicker: fontWeightPickerOptions = {},
      textAlignPicker: textAlignPickerOptions = {},
      colorPicker: colorPickerOptions = {},
      backgroundColorPicker: backgroundColorPickerOptions = {}
    } = options

    const isElementAllowed = (target, conditions) => {
      console.log('TARGET', target)

      if (!conditions.allowedTags.includes(target.attributes.tagName)) {
        return false
      }

      const elementStyles = getComputedStyle(target.view.el)
      const hasForbiddenStyle = conditions.forbiddenStyles.some(
        forbiddenStyle =>
          elementStyles[forbiddenStyle] !== '' &&
          elementStyles[forbiddenStyle] !== 'none'
      )

      if (hasForbiddenStyle) {
        return false
      }

      return true
    }

    const isMjmlElement = target => {
      return (
        target &&
        target.attributes &&
        target.attributes.tagName &&
        target.attributes.tagName.startsWith('mj-')
      )
    }

    const getStyle = target => getComputedStyle(target.view.el)

    const setStyle = (target, prop, value) => {
      const selectedTargetStyles = Object.assign({}, target.get('style'))

      console.log({ selectedTargetStyles, prop, value })
      selectedTargetStyles[prop] = value
      target.set('style', selectedTargetStyles)
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

      styleManagerContainer = panels.view.el.querySelector(
        '#mc-editor-style-manager'
      )

      if (!fontSizePickerOptions.disabled) {
        fontSizePickerContainer = document.createElement('div')
        fontSizePickerContainer.id = 'mc-editor-font-size-picker'
        styleManagerContainer.appendChild(fontSizePickerContainer)
      }

      if (!fontWeightPickerOptions.disabled) {
        fontWeightPickerContainer = document.createElement('div')
        fontWeightPickerContainer.id = 'mc-editor-font-weight-picker'
        styleManagerContainer.appendChild(fontWeightPickerContainer)
      }

      if (!textAlignPickerOptions.disabled) {
        textAlignPickerContainer = document.createElement('div')
        textAlignPickerContainer.id = 'mc-editor-text-align-picker'
        styleManagerContainer.appendChild(textAlignPickerContainer)
      }

      if (!colorPickerOptions.disabled) {
        colorPickerContainer = document.createElement('div')
        colorPickerContainer.id = 'mc-editor-color-picker'
        styleManagerContainer.appendChild(colorPickerContainer)
      }

      if (!backgroundColorPickerOptions.disabled) {
        backgroundColorPickerContainer = document.createElement('div')
        backgroundColorPickerContainer.id = 'mc-editor-background-color-picker'
        styleManagerContainer.appendChild(backgroundColorPickerContainer)
      }
    })

    editor.on('component:selected', selected => {
      if (!selected) {
        return
      }

      if (!fontWeightPickerOptions.disabled) {
        ReactDOM.unmountComponentAtNode(fontWeightPickerContainer)

        if (isElementAllowed(selected, fontWeightPickerOptions.conditions)) {
          ReactDOM.render(
            <FontWeightPicker
              value={getStyle(selected).fontWeight}
              onChange={fontWeight => {
                setStyle(selected, 'font-weight', fontWeight)
              }}
            />,
            fontWeightPickerContainer
          )
        }
      }

      if (!textAlignPickerOptions.disabled) {
        ReactDOM.unmountComponentAtNode(textAlignPickerContainer)

        if (isElementAllowed(selected, textAlignPickerOptions.conditions)) {
          ReactDOM.render(
            <TextAlignPicker
              value={
                isMjmlElement(selected)
                  ? selected.attributes.attributes.align
                  : getStyle(selected).textAlign
              }
              onChange={textAlign => {
                setStyle(selected, 'align', textAlign)
              }}
            />,
            textAlignPickerContainer
          )
        }
      }

      if (!fontSizePickerOptions.disabled) {
        if (fontSizePickerContainer) {
          ReactDOM.unmountComponentAtNode(fontSizePickerContainer)
        }

        if (isElementAllowed(selected, fontSizePickerOptions.conditions)) {
          ReactDOM.render(
            <FontSizePicker
              value={
                isMjmlElement(selected)
                  ? selected.attributes.attributes['font-size']
                  : getStyle(selected).fontSize
              }
              onChange={fontSize => {
                setStyle(selected, 'font-size', fontSize)
              }}
            />,
            fontSizePickerContainer
          )
        }
      }

      if (!colorPickerOptions.disabled) {
        ReactDOM.unmountComponentAtNode(colorPickerContainer)

        if (isElementAllowed(selected, colorPickerOptions.conditions)) {
          ReactDOM.render(
            <ColorPicker
              colors={colors}
              color={getStyle(selected).color}
              onChange={color => {
                setStyle(selected, 'color', color.hex)
              }}
            />,
            colorPickerContainer
          )
        }
      }

      if (!backgroundColorPickerOptions.disabled) {
        ReactDOM.unmountComponentAtNode(backgroundColorPickerContainer)

        if (
          isElementAllowed(selected, backgroundColorPickerOptions.conditions)
        ) {
          ReactDOM.render(
            <ColorPicker
              title="Background Color"
              colors={colors}
              color={getStyle(selected).backgroundColor}
              onChange={color => {
                setStyle(selected, 'background-color', color.hex)
              }}
            />,
            backgroundColorPickerContainer
          )
        }
      }
    })
  })
}
