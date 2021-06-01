import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import ReactDOMServer from 'react-dom/server'

import { AppTheme } from '../../../../../AppTheme'
import store from '../../../../../stores'

import { loadGrapesjs } from '../utils/load-grapes'

import { Container } from './styled'
import FontSizePicker from './FontSizePicker'
import FontWeightPicker from './FontWeightPicker'
import ColorPicker from './ColorPicker'
import TextAlignPicker from './TextAlignPicker'
import WidthPicker from './WidthPicker'
import PaddingPicker from './PaddingPicker'

function renderWithTheme(node, container) {
  ReactDOM.render(
    <Provider store={store}>
      <AppTheme>{node}</AppTheme>
    </Provider>,
    container
  )
}

export const load = async colors => {
  const { Grapesjs } = await loadGrapesjs()

  Grapesjs.plugins.add('style-manager', (editor, options) => {
    let styleManagerContainer
    let fontSizePickerContainer
    let fontWeightPickerContainer
    let widthPickerContainer
    let paddingPickerContainer
    let textAlignPickerContainer
    let colorPickerContainer
    let backgroundColorPickerContainer

    const {
      detectComponentByType,
      fontSizePicker: fontSizePickerOptions = {},
      fontWeightPicker: fontWeightPickerOptions = {},
      widthPicker: widthPickerOptions = {},
      paddingPicker: paddingPickerOptions = {},
      textAlignPicker: textAlignPickerOptions = {},
      colorPicker: colorPickerOptions = {},
      backgroundColorPicker: backgroundColorPickerOptions = {}
    } = options

    const isElementAllowed = (target, conditions) => {
      if (
        (detectComponentByType ||
          !conditions.allowedTags?.includes(target.attributes.tagName)) &&
        (!detectComponentByType ||
          !conditions.allowedTypes?.includes(
            target.attributes.attributes['data-type']
          ))
      ) {
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
      const selectedTargetStyles = { ...target.get('style') }

      selectedTargetStyles[prop] = value
      target.set('style', selectedTargetStyles)
    }

    const setMjmlAttr = (target, attr, value) => {
      target.setAttributes({
        ...target.getAttributes(),
        [attr]: value
      })
    }

    const getMjmlAttr = (target, attr) => {
      return target.getAttributes()[attr]
    }

    const getStructuredDirectionalMjmlAttr = (target, prop) => {
      const result = {
        top: '',
        right: '',
        bottom: '',
        left: ''
      }

      // First we try to get these from shortcuts
      const propValue = getMjmlAttr(target, prop) || ''
      const propValueParts = propValue.split(' ')

      // Cover formats like 20px
      if (propValue && propValueParts.length === 1) {
        result.top = propValue
        result.right = propValue
        result.bottom = propValue
        result.left = propValue
      }

      // Cover formats like 20px 20px
      if (propValueParts.length === 2) {
        result.top = propValueParts[0]
        result.bottom = propValueParts[0]
        result.right = propValueParts[1]
        result.left = propValueParts[1]
      }

      // Cover formats like 20px 20px 20px 20px or 20px 20px 20px
      if (propValueParts.length === 3 || propValueParts.length === 4) {
        result.top = propValueParts[0]
        result.right = propValueParts[1]
        result.bottom = propValueParts[2]
        result.left = propValueParts[propValueParts[propValueParts.length - 1]]
      }

      if (getMjmlAttr(target, `${prop}-top`)) {
        result.top = getMjmlAttr(target, `${prop}-top`)
      }

      if (getMjmlAttr(target, `${prop}-right`)) {
        result.right = getMjmlAttr(target, `${prop}-right`)
      }

      if (getMjmlAttr(target, `${prop}-bottom`)) {
        result.bottom = getMjmlAttr(target, `${prop}-bottom`)
      }

      if (getMjmlAttr(target, `${prop}-left`)) {
        result.left = getMjmlAttr(target, `${prop}-left`)
      }

      return result
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

      if (!widthPickerOptions.disabled) {
        widthPickerContainer = document.createElement('div')
        widthPickerContainer.id = 'mc-editor-width-picker'
        styleManagerContainer.appendChild(widthPickerContainer)
      }

      if (!paddingPickerOptions.disabled) {
        paddingPickerContainer = document.createElement('div')
        paddingPickerContainer.id = 'mc-editor-padding-picker'
        styleManagerContainer.appendChild(paddingPickerContainer)
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

    editor.on('component:deselected', () => {
      if (editor.getSelectedAll().length > 0) {
        return
      }

      const containers = [
        fontSizePickerContainer,
        fontWeightPickerContainer,
        textAlignPickerContainer,
        colorPickerContainer,
        backgroundColorPickerContainer
      ]

      containers.forEach(container => {
        if (container) {
          ReactDOM.unmountComponentAtNode(container)
        }
      })
    })

    editor.on('component:selected', selected => {
      if (!selected) {
        return
      }

      if (!fontWeightPickerOptions.disabled) {
        ReactDOM.unmountComponentAtNode(fontWeightPickerContainer)

        if (isElementAllowed(selected, fontWeightPickerOptions.conditions)) {
          renderWithTheme(
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
          renderWithTheme(
            <TextAlignPicker
              value={
                isMjmlElement(selected)
                  ? selected.attributes.attributes.align ||
                    selected.attributes.attributes.textAlign
                  : getStyle(selected).textAlign
              }
              onChange={textAlign => {
                if (isMjmlElement(selected)) {
                  setStyle(selected, 'align', textAlign)
                }

                setStyle(selected, 'text-align', textAlign)
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
          renderWithTheme(
            <FontSizePicker
              value={
                isMjmlElement(selected)
                  ? getMjmlAttr(selected, 'font-size')
                  : getStyle(selected).fontSize
              }
              onChange={fontSize => {
                // in order to sync changed text and keep the changes
                if (!selected) {
                  return
                }

                selected.trigger('sync:content')
                setStyle(selected, 'font-size', fontSize)
              }}
            />,
            fontSizePickerContainer
          )
        }
      }

      if (!widthPickerOptions.disabled) {
        ReactDOM.unmountComponentAtNode(widthPickerContainer)

        if (isElementAllowed(selected, widthPickerOptions.conditions)) {
          renderWithTheme(
            <WidthPicker
              value={
                isMjmlElement(selected)
                  ? getMjmlAttr(selected, 'width')
                  : getStyle(selected).width
              }
              onChange={width => {
                // in order to sync changed text and keep the changes
                if (!selected) {
                  return
                }

                selected.trigger('sync:content')

                if (isMjmlElement(selected)) {
                  setMjmlAttr(selected, 'width', width)
                } else {
                  setStyle(selected, 'width', width)
                }
              }}
            />,
            widthPickerContainer
          )
        }
      }

      if (!paddingPickerOptions.disabled) {
        ReactDOM.unmountComponentAtNode(paddingPickerContainer)

        if (isElementAllowed(selected, paddingPickerOptions.conditions)) {
          const { top, bottom } = isMjmlElement(selected)
            ? getStructuredDirectionalMjmlAttr(selected, 'padding')
            : {
                top: getStyle(selected).paddingTop,
                bottom: getStyle(selected).paddingBottom
              }

          renderWithTheme(
            <PaddingPicker
              value={{
                top,
                bottom
              }}
              onChange={padding => {
                // in order to sync changed text and keep the changes
                if (!selected) {
                  return
                }

                selected.trigger('sync:content')

                if (isMjmlElement(selected)) {
                  setMjmlAttr(selected, 'padding-top', padding.top)
                  setMjmlAttr(selected, 'padding-bottom', padding.bottom)
                } else {
                  setStyle(selected, 'padding-top', padding.top)
                  setStyle(selected, 'padding-bottom', padding.bottom)
                }
              }}
            />,
            paddingPickerContainer
          )
        }
      }

      if (!colorPickerOptions.disabled) {
        ReactDOM.unmountComponentAtNode(colorPickerContainer)

        if (isElementAllowed(selected, colorPickerOptions.conditions)) {
          renderWithTheme(
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
          renderWithTheme(
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
