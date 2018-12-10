import React, { Fragment } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import '../../../../styles/components/modules/template-builder.scss'

import './AssetManager'
import juice from 'juice'

import IconButton from 'components/Button/IconButton'
import DropButton from 'components/Button/DropButton'
import ActionButton from 'components/Button/ActionButton'
// import { Icon as DropdownIcon } from 'components/Dropdown'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import { TeamContactSelect } from 'components/TeamContact/TeamContactSelect'

import { VideoToolbar } from './VideoToolbar'

import config from './config'

import nunjucks from '../helpers/nunjucks'

import {
  Container,
  Actions,
  TemplatesContainer,
  BuilderContainer,
  Header,
  Divider
} from './styled'
import Templates from '../Templates'

class Builder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      template: null,
      selectedTemplate: props.defaultTemplate,
      owner: props.templateData.user
    }

    this.keyframe = 0

    this.traits = {
      link: [
        {
          type: 'text',
          label: 'Link',
          name: 'href'
        }
      ]
    }
  }

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
        autoload: 0,
        params: {
          templateId: null
        }
      },
      showDevices: false,
      plugins: ['asset-blocks']
    })

    this.editor.on('load', this.setupGrapesJs)
  }

  setupGrapesJs = () => {
    this.lockIn()
    this.disableResize()
    this.singleClickTextEditing()
    this.disableAssetManager()
    this.makeTemplateCentered()

    if (this.IsVideoTemplate) {
      this.grapes.appendChild(this.videoToolbar)
    }
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

  makeTemplateCentered = () => {
    const iframe = this.editor.Canvas.getFrameEl()

    const style = document.createElement('style')
    const css =
      'body { margin: 2vh auto !important; background-color: #f2f2f2 !important }'

    style.type = 'text/css'

    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }

    iframe.contentDocument.head.appendChild(style)
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

      model.set({
        draggable: false,
        droppable: false,
        traits: this.traits[model.get('type')] || []
      })

      model.get('components').each(model => updateAll(model))
    }

    updateAll(this.editor.DomComponents.getWrapper())
  }

  getSavedTempldate() {
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

    return {
      ...this.state.selectedTemplate,
      result: juice(assembled)
    }
  }

  handleSave = () =>
    this.props.onSave(this.getSavedTempldate(), this.state.owner)

  handleSocialSharing = socialName =>
    this.props.onSocialSharing(this.getSavedTempldate(), socialName)

  generateTemplate = (template, data) => nunjucks.renderString(template, data)

  setEditorTemplateId = id => {
    this.editor.StorageManager.store({
      templateId: id
    })
  }

  refreshEditor = selectedTemplate => {
    const components = this.editor.DomComponents

    components.clear()
    this.editor.setStyle('')
    this.setEditorTemplateId(selectedTemplate.id)
    this.editor.setComponents(selectedTemplate.template)
    this.lockIn()
  }

  setTemplate = newState => {
    this.setState(newState, () =>
      this.refreshEditor(this.state.selectedTemplate)
    )
  }

  handleSelectTemplate = templateItem =>
    this.setTemplate(state => ({
      template: templateItem,
      selectedTemplate: {
        ...templateItem,
        template: this.generateTemplate(templateItem.template, {
          ...this.props.templateData,
          user: state.owner
        })
      }
    }))

  handleOwnerChange = ({ value: owner }) =>
    this.setTemplate(state => ({
      owner,
      selectedTemplate: {
        ...state.selectedTemplate,
        template: this.generateTemplate(state.template.template, {
          ...this.props.templateData,
          user: owner
        })
      }
    }))

  get IsVideoTemplate() {
    return this.state.template && this.state.template.video
  }

  get IsTemplateLoaded() {
    return this.state.selectedTemplate && this.state.selectedTemplate.template
  }

  get IsSocialMedium() {
    if (this.state.selectedTemplate) {
      return this.state.selectedTemplate.medium !== 'Email'
    }

    if (this.props.mediums) {
      return this.props.mediums !== 'Email'
    }

    return false
  }

  renderAgentPickerButton = buttonProps => (
    <DropButton
      {...buttonProps}
      text={`Sends as: ${buttonProps.selectedItem.label}`}
    />
  )

  render() {
    const isSocialMedium = this.IsSocialMedium

    return (
      <Container className="template-builder">
        <Header>
          <h1>{this.props.headerTitle}</h1>

          <Actions>
            <TeamContactSelect
              fullHeight
              pullTo="right"
              user={this.props.templateData.user}
              owner={this.state.owner}
              onSelect={this.handleOwnerChange}
              style={{ marginRight: '0.5rem' }}
              buttonRenderer={this.renderAgentPickerButton}
            />

            {this.state.selectedTemplate &&
              isSocialMedium && (
                <Fragment>
                  <ActionButton
                    onClick={() => this.handleSocialSharing('Instagram')}
                  >
                    <i
                      className="fa fa-instagram"
                      style={{
                        fontSize: '1.5rem',
                        marginRight: '0.5rem'
                      }}
                    />
                    Post to Instagram
                  </ActionButton>

                  <ActionButton
                    style={{ marginLeft: '0.5rem' }}
                    onClick={() => this.handleSocialSharing('Facebook')}
                  >
                    <i
                      className="fa fa-facebook-square"
                      style={{
                        fontSize: '1.5rem',
                        marginRight: '0.5rem'
                      }}
                    />
                    Post to Facebook
                  </ActionButton>
                </Fragment>
              )}

            {this.state.selectedTemplate &&
              !isSocialMedium && (
                <ActionButton
                  style={{ marginLeft: '0.5rem' }}
                  onClick={this.handleSave}
                >
                  {this.props.saveButtonLabel}
                </ActionButton>
              )}

            <Divider />
            <IconButton
              isFit
              iconSize="large"
              inverse
              onClick={this.props.onClose}
            >
              <CloseIcon />
            </IconButton>
          </Actions>
        </Header>

        <BuilderContainer>
          <TemplatesContainer
            isInvisible={this.props.showTemplatesColumn === false}
          >
            <Templates
              defaultTemplate={this.props.defaultTemplate}
              medium={this.props.mediums}
              onTemplateSelect={this.handleSelectTemplate}
              templateTypes={this.props.templateTypes}
            />
          </TemplatesContainer>

          <div
            id="grapesjs-canvas"
            ref={ref => (this.grapes = ref)}
            style={{ position: 'relative' }}
          >
            {this.IsVideoTemplate &&
              this.IsTemplateLoaded && (
                <VideoToolbar
                  onRef={ref => (this.videoToolbar = ref)}
                  editor={this.editor}
                />
              )}
          </div>
        </BuilderContainer>
      </Container>
    )
  }
}

export default Builder
