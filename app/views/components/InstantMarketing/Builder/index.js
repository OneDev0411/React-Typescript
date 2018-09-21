import React from 'react'

import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import '../../../../styles/components/modules/template-builder.scss'

import nunjucks from 'nunjucks'

import './AssetManager'
import config from './config'

import PhoneNumber from 'google-libphonenumber'

import {
  Container,
  TemplatesContainer,
  BuilderContainer,
  Header
} from './styled'
import Templates from '../Templates'

import juice from 'juice'
import ActionButton from 'components/Button/ActionButton'

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

    this.editor.on('load', this.setupGrapesJs.bind(this))
    this.setupNunjucks()
  }

  setupGrapesJs = () => {
    this.lockIn()
    this.disableResize()
    this.singleClickTextEditing()
    this.disableAssetManager()
  }

  setupNunjucks = () => {
    this.nunjucks = new nunjucks.Environment()

    this.nunjucks.addFilter('currency', price =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price)
    )

    this.nunjucks.addFilter('area', area_meters =>
      new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(area_meters * 10.7639)
    )

    const pnu = new PhoneNumber.PhoneNumberUtil()

    this.nunjucks.addFilter('phone', phone => {
      let pn

      try {
        pn = pnu.parse(phone)
      } catch (e) {
        return phone // Cannot parse it.
      }

      return pnu.format(pn, PhoneNumber.PhoneNumberFormat.NATIONAL)
    })
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

  handleSelectTemplate = templateItem => {
    const template = {
      ...templateItem,
      template: this.nunjucks.renderString(templateItem.template, {
        ...this.props.templateData
      })
    }

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
        <Header>
          <h1>Marketing Center</h1>

          <div>
            <ActionButton inverse onClick={this.props.onClose}>
              Cancel
            </ActionButton>

            <ActionButton
              style={{ marginLeft: '0.5rem' }}
              onClick={this.onSave}
            >
              Send
            </ActionButton>
          </div>
        </Header>

        <BuilderContainer>
          <TemplatesContainer>
            <Templates
              onTemplateSelect={this.handleSelectTemplate}
              templateTypes={this.props.templateTypes}
            />
          </TemplatesContainer>
          <div id="grapesjs-canvas" />
        </BuilderContainer>
      </Container>
    )
  }
}

export default Builder
