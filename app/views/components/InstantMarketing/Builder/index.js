import React from 'react'

import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import '../../../../styles/components/modules/template-builder.scss'

import './AssetManager'
import config from './config'

import { Container, TemplatesContainer } from './styled'
import Templates from '../Templates'

import juice from 'juice'

class Builder extends React.Component {
  componentDidMount() {
    this.editor = grapesjs.init({
      ...config,
      avoidInlineStyle: false,
      keepUnusedStyles: true,
      forceClass: false,
      container: '#grapesjs-canvas',
      components: null,
      assetManager: {
        assets: this.props.assets
      },
      storageManager: {
        autoload: 0
      },
      showDevices: false,
      plugins: ['asset-blocks']
    })

    this.editor.on('load', this.setup.bind(this))
  }

  setup = () => {
    this.addCloseButton()
    this.addSaveButton()
    this.lockIn()
    this.disableResize()
    this.singleClickTextEditing()
    this.disableAssetManager()
  }

  disableAssetManager = () => {
    this.editor.on('run:open-assets', () => this.editor.Modal.close())
  }

  singleClickTextEditing = () => {
    this.editor.on('component:selected', selected => {
      if (!selected.view.enableEditing) {
        return
      }

      selected.view.enableEditing(selected.view.el)
    })
  }

  disableResize = () => {
    const components = this.editor.DomComponents

    const image = components.getType('image')

    const defaults = image.model.prototype.defaults

    const updated = image.model.extend({
      defaults: Object.assign({}, defaults, {
        resizable: false
      })
    })

    components.addType('image', {
      model: updated,
      view: image.view
    })
  }

  addCloseButton = () => {
    const command = {
      id: 'close-builder',
      run: this.props.onClose
    }

    const button = {
      id: 'close-builder',
      className: 'fa fa-close',
      command
    }

    this.editor.Panels.addButton('views', button)
  }

  addSaveButton = () => {
    if (!this.props.onSave) {
      return false
    }

    const command = {
      id: 'save',
      run: this.onSave.bind(this)
    }

    const button = {
      id: 'save',
      className: 'fa fa-save',
      command
    }

    this.editor.Panels.addButton('views', button)
  }

  lockIn = () => {
    const updateAll = model => {
      const editable =
        model && model.view && model.view.$el.attr('rechat-editable')

      if (!editable) {
        model.set({
          editable: false,
          selectable: false,
          hoverable: false
        })
      }

      model.get('components').each(model => updateAll(model))
    }

    updateAll(this.editor.DomComponents.getWrapper())
  }

  onSave = () => {
    const css = this.editor.getCss()
    const html = this.editor.getHtml()

    const assembled = `
      <!doctype html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>`

    const result = juice(assembled)

    if (this.props.onSave) {
      this.props.onSave({
        ...this.selectedTemplate,
        result
      })

      this.selectedTemplate = null
    }
  }

  handleSelectTemplate = template => {
    this.selectedTemplate = template

    const components = this.editor.DomComponents

    components.clear()
    this.editor.setStyle('')
    this.editor.setComponents(template.template)
    this.lockIn()
  }

  render() {
    return (
      <Container className="template-builder">
        <TemplatesContainer>
          <Templates
            templateData={this.props.templateData}
            onTemplateSelect={this.handleSelectTemplate}
          />
        </TemplatesContainer>

        <div id="grapesjs-canvas" />
      </Container>
    )
  }
}

export default Builder
