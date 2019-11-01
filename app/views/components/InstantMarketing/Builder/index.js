import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import juice from 'juice'

import { Portal } from 'components/Portal'
import IconButton from 'components/Button/IconButton'
import DropButton from 'components/Button/DropButton'
import ActionButton from 'components/Button/ActionButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import { TeamContactSelect } from 'components/TeamContact/TeamContactSelect'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { getActiveTeam } from 'utils/user-teams'
import { getBrandStyles } from 'utils/marketing-center/templates'

import nunjucks from '../helpers/nunjucks'
import {
  getAsset as getBrandAsset,
  getListingUrl,
  getColor
} from '../helpers/nunjucks-functions'
import { getBrandColors } from '../helpers/get-brand-colors'

import { loadGrapesjs } from './utils/load-grapes'
import { createGrapesInstance } from './utils/create-grapes-instance'

import Templates from '../Templates'
import { VideoToolbar } from './VideoToolbar'

import {
  Container,
  Actions,
  TemplatesContainer,
  BuilderContainer,
  Header,
  Divider
} from './styled'

import SocialActions from './SocialActions'
import { SOCIAL_NETWORKS } from './constants'

class Builder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      originalTemplate: null,
      selectedTemplate: props.defaultTemplate,
      owner: props.templateData.user,
      isLoading: true,
      isEditorLoaded: false,
      templateHtmlCss: ''
    }

    this.keyframe = 0

    this.traits = {
      link: [
        {
          type: 'text',
          label: 'Link',
          name: 'href'
        }
      ],

      'mj-button': [
        {
          type: 'text',
          label: 'Link',
          name: 'href'
        }
      ]
    }
  }

  async componentDidMount() {
    const { Grapesjs, GrapesjsMjml } = await loadGrapesjs()

    const { load: loadAssetManagerPlugin } = await import('./AssetManager')
    const { load: loadStyleManagerPlugin } = await import('./StyleManager')

    const { brand } = getActiveTeam(this.props.user)
    const brandColors = getBrandColors(brand)

    await Promise.all([
      loadAssetManagerPlugin(),
      loadStyleManagerPlugin(brandColors)
    ])

    this.setState({
      isLoading: false
    })

    this.editor = createGrapesInstance(Grapesjs, {
      assets: [...this.props.assets, ...this.UserAssets],
      plugins: [GrapesjsMjml],
      pluginsOpts: {
        [GrapesjsMjml]: {
          columnsPadding: false
        }
      }
    })

    this.editor.on('load', this.setupGrapesJs)
  }

  componentWillUnmount() {
    if (this.editor) {
      const iframe = this.editor.Canvas.getBody()

      iframe.removeEventListener('paste', this.iframePasteHandler)
    }
  }

  static contextType = ConfirmationModalContext

  setupGrapesJs = () => {
    this.setState({ isEditorLoaded: true })

    this.lockIn()
    this.singleClickTextEditing()
    this.disableAssetManager()
    this.disableDeviceManager()
    this.makeTemplateCentered()
    this.removeTextStylesOnPaste()

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

  disableDeviceManager = () => {
    this.editor.Panels.removePanel('devices-c')
  }

  singleClickTextEditing = () => {
    this.editor.on('component:selected', selected => {
      const isImageAsset =
        selected.get('type') === 'image' || selected.get('type') === 'mj-image'

      if (!selected.view.onActive || isImageAsset) {
        return
      }

      selected.view.onActive(selected.view.el)
    })
  }

  makeTemplateCentered = () => {
    const iframe = this.editor.Canvas.getFrameEl()

    const style = document.createElement('style')
    const css =
      'body { margin: 0 auto !important; background-color: #ffffff !important }'

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

  removeTextStylesOnPaste = () => {
    const iframe = this.editor.Canvas.getBody()

    iframe.addEventListener('paste', this.iframePasteHandler)
  }

  iframePasteHandler = ev => {
    if (!ev.target.contentEditable) {
      return
    }

    ev.preventDefault()

    const text = ev.clipboardData.getData('text')

    ev.target.ownerDocument.execCommand('insertText', false, text)
  }

  lockIn = () => {
    let shouldSelectImage = true

    const updateAll = model => {
      const attributes = model.get('attributes')

      const editable = attributes.hasOwnProperty('rechat-editable')

      const isRechatAsset = attributes.hasOwnProperty('rechat-assets')

      if (!editable) {
        model.set({
          editable: false,
          selectable: isRechatAsset,
          hoverable: isRechatAsset
        })
      }

      model.set({
        resizable: false,
        draggable: false,
        droppable: false,
        traits: this.traits[model.get('type')] || []
      })

      if (
        shouldSelectImage &&
        attributes['rechat-assets'] === 'listing-image'
      ) {
        shouldSelectImage = false
        this.editor.select(model)
      }

      model.get('components').each(model => {
        updateAll(model, shouldSelectImage)
      })
    }

    updateAll(this.editor.DomComponents.getWrapper())
  }

  getSavedTemplate() {
    if (this.state.selectedTemplate.mjml) {
      return this.getMjmlTemplate()
    }

    return this.getHtmlTemplate()
  }

  getMjmlTemplate() {
    const result = this.editor.getHtml()

    return {
      ...this.state.selectedTemplate,
      result
    }
  }

  getHtmlTemplate() {
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

    /*
     * Email clients are far better at rendering inline css.
     * Therefore, we use Juice to inline them.
     *
     * However, inlining has some issues. Pseudo elements, media queries
     * and such are not really inline-able.
     *
     * Therefore, we do the inlining when necessary: Only on Emails.
     *
     * There's no reason to go through that fragile process on social templates
     */

    const shouldInline = this.state.selectedTemplate.medium === 'Email'

    const result = shouldInline ? juice(assembled) : assembled

    return {
      ...this.state.selectedTemplate,
      result
    }
  }

  // We should always make sure the markup is rendered before doing any save
  // We are doing this hack as GrapesJS load event is not useful to make sure the template markup is loaded
  isTemplateMarkupRendered = () => {
    return this.editor.getHtml().trim() !== ''
  }

  handleSave = () => {
    if (!this.isTemplateMarkupRendered()) {
      return
    }

    this.props.onSave(this.getSavedTemplate(), this.state.owner)
  }

  handleSocialSharing = socialNetworkName => {
    if (!this.isTemplateMarkupRendered()) {
      return
    }

    this.props.onSocialSharing(this.getSavedTemplate(), socialNetworkName)
  }

  generateBrandedTemplate = (template, data) => {
    const { brand } = getActiveTeam(this.props.user)
    const palette = getBrandStyles(brand)

    return nunjucks.renderString(template, {
      ...data,
      palette,
      getAsset: getBrandAsset.bind(null, brand),
      getListingUrl: getListingUrl.bind(null, brand),
      getColor: getColor.bind(null, brand)
    })
  }

  setEditorTemplateId = id => {
    this.editor.StorageManager.store({
      templateId: id
    })
  }

  refreshEditor = selectedTemplate => {
    const components = this.editor.DomComponents
    let html = selectedTemplate.template

    // GrapeJS doesn't support for inline style for body tag, we are making our styles
    // Inline using juice. so we need to extract them and put them in <head>
    // Note: this is only useful for EDIT mode.
    const regex = /<body.*?(style="(.*?)")+?.*?>/g
    const searchInTemplates = regex.exec(html)

    if (Array.isArray(searchInTemplates) && searchInTemplates.length === 3) {
      html = html.replace(
        '<head>',
        `<head><style>body{${searchInTemplates[2]}}</style>`
      )
    }

    components.clear()
    this.editor.setStyle('')
    this.setEditorTemplateId(selectedTemplate.id)
    this.editor.setComponents(html)
    this.lockIn()
    this.setState({
      templateHtmlCss: this.getTemplateHtmlCss()
    })
  }

  getTemplateHtmlCss = () => {
    return `${this.editor.getCss()}${this.editor.getHtml()}`
  }

  isTemplateChanged = () => {
    return this.getTemplateHtmlCss() !== this.state.templateHtmlCss
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
    if (!this.isTemplateChanged()) {
      this.setState({
        owner
      })

      this.regenerateTemplate({
        user: owner
      })

      return
    }

    this.context.setConfirmationModal({
      message: 'Change sender?',
      description:
        "All the changes you've made to the template will be lost. Are you sure?",
      confirmLabel: 'Yes, I am sure',
      onConfirm: () => {
        this.setState({
          owner
        })

        this.regenerateTemplate({
          user: owner
        })
      }
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
      this.state.originalTemplate &&
      this.props.templateTypes.includes('Listings') &&
      this.props.templateData.listings
    )
  }

  get IsSocialMedium() {
    if (this.props.templateTypes.includes('CrmOpenHouse')) {
      return false
    }

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

  get socialNetworks() {
    if (!this.state.selectedTemplate) {
      return []
    }

    if (this.state.selectedTemplate.medium === 'LinkedInCover') {
      return SOCIAL_NETWORKS.filter(({ name }) => name === 'LinkedIn')
    }

    return SOCIAL_NETWORKS.filter(({ name }) => name !== 'LinkedIn')
  }

  renderAgentPickerButton = buttonProps => (
    <DropButton
      {...buttonProps}
      iconSize="large"
      text={`Sends as: ${buttonProps.selectedItem.label}`}
    />
  )

  regenerateTemplate = newData => {
    this.setState(
      state => ({
        selectedTemplate: {
          ...state.selectedTemplate,
          template: this.generateBrandedTemplate(
            state.originalTemplate.template,
            {
              ...this.props.templateData,
              ...newData
            }
          )
        }
      }),
      () => {
        this.refreshEditor(this.state.selectedTemplate)
      }
    )
  }

  render() {
    const { isLoading } = this.state

    if (isLoading) {
      return null
    }

    const isSocialMedium = this.IsSocialMedium
    const socialNetworks = this.socialNetworks

    return (
      <Portal root="marketing-center">
        <Container
          className="template-builder"
          style={this.props.containerStyle}
        >
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

              {this.ShowEditListingsButton && !this.props.isEdit && (
                <ActionButton
                  style={{ marginLeft: '0.5rem' }}
                  appearance="outline"
                  onClick={this.props.onShowEditListings}
                >
                  Edit Listings ({this.props.templateData.listings.length})
                </ActionButton>
              )}

              {this.state.selectedTemplate && isSocialMedium && (
                <SocialActions
                  networks={socialNetworks}
                  onClick={this.handleSocialSharing}
                />
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
              {this.state.isEditorLoaded && (
                <Templates
                  defaultTemplate={this.props.defaultTemplate}
                  medium={this.props.mediums}
                  onTemplateSelect={this.handleSelectTemplate}
                  templateTypes={this.props.templateTypes}
                  isEdit={this.props.isEdit}
                />
              )}
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
      </Portal>
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
