import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'

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
      originalTemplate: null,
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
        assets: [...this.props.assets, ...this.UserAssets]
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

    this.props.onBuilderLoad({
      regenerateTemplate: this.regenerateTemplate
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

    if (!iframe.contentDocument) {
      console.warn('iframe contentDocument is null')

      return false
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

  getSavedTemplate() {
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
    this.props.onSave(this.getSavedTemplate(), this.state.owner)

  handleSocialSharing = socialNetworkName =>
    this.props.onSocialSharing(this.getSavedTemplate(), socialNetworkName)

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

  handleSelectTemplate = templateItem => {
    this.setState(
      {
        originalTemplate: templateItem,
        selectedTemplate: templateItem
      },
      () => {
        this.regenerateTemplate({
          user: this.state.owner
        })
      }
    )
  }

  handleOwnerChange = ({ value: owner }) => {
    this.setState({
      owner
    })

    this.regenerateTemplate({
      user: owner
    })
  }

  get IsVideoTemplate() {
    return this.state.selectedTemplate && this.state.selectedTemplate.video
  }

  get IsTemplateLoaded() {
    return this.state.selectedTemplate && this.state.selectedTemplate.template
  }

  get ShowEditListingsButton() {
    return (
      this.props.templateTypes.includes('Listings') &&
      this.props.templateData.listings
    )
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

  get UserAssets() {
    return ['profile_image_url', 'cover_image_url']
      .filter(attr => this.props.user[attr])
      .map(attr => ({
        image: this.props.user[attr],
        avatar: true
      }))
  }

  renderAgentPickerButton = buttonProps => (
    <DropButton
      {...buttonProps}
      iconSize="large"
      text={`Sends as: ${buttonProps.selectedItem.label}`}
    />
  )

  regenerateTemplate = newData => {
    console.log('[ + ] Regenerate template')

    this.setState(
      state => ({
        selectedTemplate: {
          ...state.selectedTemplate,
          template: this.generateTemplate(state.originalTemplate.template, {
            ...this.props.templateData,
            ...newData
          })
        }
      }),
      () => {
        this.refreshEditor(this.state.selectedTemplate)
      }
    )
  }

  render() {
    const isSocialMedium = this.IsSocialMedium

    return (
      <Container className="template-builder">
        <Header>
          <h1>{this.props.headerTitle}</h1>

          <Actions>
            {this.state.selectedTemplate && (
              <TeamContactSelect
                fullHeight
                pullTo="right"
                user={this.props.templateData.user}
                owner={this.state.owner}
                onSelect={this.handleOwnerChange}
                buttonRenderer={this.renderAgentPickerButton}
                style={{
                  marginRight: '0.5rem'
                }}
              />
            )}

            {this.ShowEditListingsButton && (
              <ActionButton
                style={{ marginLeft: '0.5rem' }}
                appearance="outline"
                onClick={this.props.onShowEditListings}
              >
                Edit Listings ({this.props.templateData.listings.length})
              </ActionButton>
            )}

            {this.state.selectedTemplate && isSocialMedium && (
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

            {this.state.selectedTemplate && !isSocialMedium && (
              <ActionButton
                style={{ marginLeft: '0.5rem' }}
                onClick={this.handleSave}
              >
                Next
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
            {this.IsVideoTemplate && this.IsTemplateLoaded && (
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

Builder.propTypes = {
  onBuilderLoad: PropTypes.func
}

Builder.defaultProps = {
  onBuilderLoad: () => null
}

function mapStateToProps({ user }) {
  return {
    user
  }
}

export default connect(mapStateToProps)(Builder)
