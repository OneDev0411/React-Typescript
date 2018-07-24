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

  onSave = () => {
    const css = this.editor.getCss()
    const js = this.editor.getJs()
    const html = this.editor.getHtml()
    const result = `<!DOCTYPE html><style>${css}</style><script type="text/javascript">${js}</script>${html}</html>`
    const inlined = juice(result)

    if (this.props.onSave) {
      this.props.onSave({
        ...this.selectedTemplate,
        inlined
      })

      this.selectedTemplate = null
    }
  }

  handleSelectTemplate = template => {
    this.selectedTemplate = template
    this.editor.setComponents(template.template)
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
