import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import juice from 'juice'
import { Button } from '@material-ui/core'

import { Portal } from 'components/Portal'
import IconButton from 'components/Button/IconButton'
import DropButton from 'components/Button/DropButton'
import ActionButton from 'components/Button/ActionButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import { TeamContactSelect } from 'components/TeamContact/TeamContactSelect'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import IconNav from 'components/SvgIcons/NavMenu/IconNav'
import SearchListingDrawer from 'components/SearchListingDrawer'
import TeamAgents from 'components/TeamAgents'
import ImageDrawer from 'components/ImageDrawer'
import GifDrawer from 'components/GifDrawer'
import VideoDrawer from 'components/VideoDrawer'

import { getActiveTeam } from 'utils/user-teams'

import nunjucks from '../helpers/nunjucks'
import { getBrandColors } from '../helpers/get-brand-colors'

import { loadGrapesjs } from './utils/load-grapes'
import { createGrapesInstance } from './utils/create-grapes-instance'

import Templates from '../Templates'
import { VideoToolbar } from './VideoToolbar'
import UndoRedoManager from './UndoRedoManager'
import DeviceManager from './DeviceManager'

import {
  Container,
  Actions,
  TemplatesContainer,
  BuilderContainer,
  Header
} from './styled'

import SocialActions from './SocialActions'
import { SOCIAL_NETWORKS, BASICS_BLOCK_CATEGORY } from './constants'
import { registerCustomBlocks } from './Blocks'
import { removeUnusedBlocks } from './Blocks/utils'
import getTemplateRenderData from './utils/get-template-render-data'

class Builder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      originalTemplate: null,
      selectedTemplate: props.defaultTemplate,
      owner: props.templateData.user,
      isLoading: true,
      isEditorLoaded: false,
      templateHtmlCss: '',
      isTemplatesColumnHidden: false,
      loadedListingsAssets: [],
      isListingDrawerOpen: false,
      isAgentDrawerOpen: false,
      isImageDrawerOpen: false,
      isGifDrawerOpen: false,
      isVideoDrawerOpen: false
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
      ],

      'mj-image': [],

      'mj-wrapper': []
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
      assets: [...this.props.assets, ...this.userAssets],
      plugins: [GrapesjsMjml],
      pluginsOpts: {
        [GrapesjsMjml]: {
          columnsPadding: false,
          categoryLabel: BASICS_BLOCK_CATEGORY
        }
      }
    })

    this.initLoadedListingsAssets()

    this.editor.on('load', this.setupGrapesJs)
  }

  componentWillUnmount() {
    if (this.editor) {
      const iframe = this.editor.Canvas.getBody()

      iframe.removeEventListener('paste', this.iframePasteHandler)
    }
  }

  static contextType = ConfirmationModalContext

  initLoadedListingsAssets = () => {
    const loadedListingsAssets = []

    if (this.props.templateData.listings) {
      loadedListingsAssets.push(
        ...this.props.templateData.listings.map(item => item.id)
      )
    }

    if (this.props.templateData.listing) {
      loadedListingsAssets.push(this.props.templateData.listing.id)
    }

    this.setState({ loadedListingsAssets })
  }

  addListingAssets = listing => {
    if (this.state.loadedListingsAssets.includes(listing.id)) {
      return
    }

    this.editor.AssetManager.add(
      listing.gallery_image_urls.map(image => ({
        listing: listing.id,
        image
      }))
    )
    this.setState(prevState => {
      return {
        ...prevState,
        loadedListingsAssets: [...prevState.loadedListingsAssets, listing.id]
      }
    })
  }

  addAgentAssets = agent => {
    this.editor.AssetManager.add(
      ['profile_image_url', 'cover_image_url']
        .filter(attr => agent[attr])
        .map(attr => ({
          image: agent[attr],
          avatar: true
        }))
    )
  }

  setupGrapesJs = () => {
    this.setState({ isEditorLoaded: true })

    this.lockIn()
    this.singleClickTextEditing()
    this.disableAssetManager()
    this.makeTemplateCentered()
    this.removeTextStylesOnPaste()
    this.disableDefaultDeviceManager()

    if (this.isEmailTemplate && this.isMjmlTemplate) {
      this.registerBlocks()
    }

    if (this.isVideoTemplate) {
      this.grapes.appendChild(this.videoToolbar)
    }

    this.props.onBuilderLoad({
      regenerateTemplate: this.regenerateTemplate
    })
  }

  customizeRTE = () => {
    const rte = this.editor.RichTextEditor
    const items = rte.getAll()

    items.map(i => i.name).forEach(rte.remove.bind(rte))

    if (!this.isEmailTemplate) {
      return
    }

    const icon = `<select>
      <option>Insert Placeholder</option>
      <option value="{{recipient.first_name or 'there'}}">Recipient First Name</option>
      <option value="{{recipient.last_name or 'there'}}">Recipient Last Name</option>
    </select>`

    rte.add('first_name', {
      icon,
      event: 'change',
      result: (rte, action) => {
        const { value } = action.btn.firstChild

        if (!value) {
          return
        }

        rte.insertHTML(value)
      }
    })
  }

  registerBlocks = () => {
    const { brand } = getActiveTeam(this.props.user)
    const renderData = getTemplateRenderData(brand)

    removeUnusedBlocks(this.editor)
    this.blocks = registerCustomBlocks(this.editor, renderData, {
      listing: {
        onDrop: () => {
          this.setState({ isListingDrawerOpen: true })
        }
      },
      agent: {
        onDrop: () => {
          this.setState({ isAgentDrawerOpen: true })
        }
      },
      image: {
        onDrop: () => {
          this.setState({ isImageDrawerOpen: true })
        }
      },
      gif: {
        onDrop: () => {
          this.setState({ isGifDrawerOpen: true })
        }
      },
      video: {
        onDrop: () => {
          this.setState({ isVideoDrawerOpen: true })
        }
      }
    })
  }

  disableAssetManager = () => {
    this.editor.on('run:open-assets', () => this.editor.Modal.close())
  }

  disableDefaultDeviceManager = () => {
    this.editor.Panels.removePanel('devices-c')
  }

  singleClickTextEditing = () => {
    this.editor.on('component:selected', selected => {
      this.setTraits(selected)

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

  setTraits = model => {
    model.set({
      traits: this.traits[model.get('type')] || []
    })
  }

  lockIn = () => {
    let shouldSelectImage = false

    const updateAll = model => {
      const attributes = model.get('attributes')

      const editable = attributes.hasOwnProperty('rechat-editable')
      // const draggable = attributes.hasOwnProperty('rechat-draggable')
      const draggable = this.isMjmlTemplate && this.isEmailTemplate
      // const droppable = attributes.hasOwnProperty('rechat-dropable')
      const droppable = this.isMjmlTemplate && this.isEmailTemplate

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
        draggable,
        droppable
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

    const shouldInline = this.isEmailTemplate

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
    const renderData = getTemplateRenderData(brand)

    return nunjucks.renderString(template, {
      ...data,
      ...renderData
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
    this.customizeRTE()
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

  get isVideoTemplate() {
    return this.state.selectedTemplate && this.state.selectedTemplate.video
  }

  get isEmailTemplate() {
    return this.state.selectedTemplate.medium === 'Email'
  }

  get isMjmlTemplate() {
    return this.state.selectedTemplate.mjml
  }

  get isTemplateLoaded() {
    return this.state.selectedTemplate && this.state.selectedTemplate.template
  }

  get showEditListingsButton() {
    return (
      this.state.originalTemplate &&
      this.props.templateTypes.includes('Listings') &&
      this.props.templateData.listings
    )
  }

  get isSocialMedium() {
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

  get userAssets() {
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

  toggeleTemplatesColumnVisibility = () => {
    this.setState(prevState => ({
      ...prevState,
      isTemplatesColumnHidden: !prevState.isTemplatesColumnHidden
    }))
  }

  render() {
    const { isLoading } = this.state

    if (isLoading) {
      return null
    }

    const isSocialMedium = this.isSocialMedium
    const socialNetworks = this.socialNetworks

    return (
      <Portal root="marketing-center">
        <Container
          className="template-builder"
          disableDesignerMode={!this.isEmailTemplate || !this.isMjmlTemplate}
        >
          <SearchListingDrawer
            mockListings
            multipleSelection
            isOpen={this.state.isListingDrawerOpen}
            title="Select a Listing"
            onClose={() => {
              this.blocks.listing.selectHandler()
              this.setState({ isListingDrawerOpen: false })
            }}
            onSelectListingsCallback={listings => {
              listings.forEach(this.addListingAssets)

              this.blocks.listing.selectHandler(listings)
              this.setState({ isListingDrawerOpen: false })
            }}
          />
          {this.state.isAgentDrawerOpen && (
            <TeamAgents
              isPrimaryAgent
              user={this.props.user}
              title="Select An Agent"
              onClose={() => {
                this.blocks.agent.selectHandler()
                this.setState({ isAgentDrawerOpen: false })
              }}
              onSelectAgent={agent => {
                console.log('onSelectAgent', agent)
                this.addAgentAssets(agent)
                this.blocks.agent.selectHandler(agent)
                this.setState({ isAgentDrawerOpen: false })
              }}
            />
          )}
          <ImageDrawer
            isOpen={this.state.isImageDrawerOpen}
            onClose={() => {
              this.blocks.image.selectHandler()
              this.setState({ isImageDrawerOpen: false })
            }}
            onSelect={imageItem => {
              this.blocks.image.selectHandler(imageItem)
              this.setState({ isImageDrawerOpen: false })
            }}
          />
          <GifDrawer
            isOpen={this.state.isGifDrawerOpen}
            onClose={() => {
              this.blocks.gif.selectHandler()
              this.setState({ isGifDrawerOpen: false })
            }}
            onSelect={gifItem => {
              this.blocks.gif.selectHandler(gifItem)
              this.setState({ isGifDrawerOpen: false })
            }}
          />
          <VideoDrawer
            isOpen={this.state.isVideoDrawerOpen}
            onClose={() => {
              this.blocks.video.selectHandler()
              this.setState({ isVideoDrawerOpen: false })
            }}
            onSelect={video => {
              this.blocks.video.selectHandler(video)
              this.setState({ isVideoDrawerOpen: false })
            }}
          />
          <Header>
            <Button
              size="small"
              variant="outlined"
              style={{ width: '8.75rem' }}
              onClick={this.toggeleTemplatesColumnVisibility}
            >
              <IconNav />
              &nbsp;&nbsp;
              {this.state.isTemplatesColumnHidden
                ? 'Show Templates'
                : 'Hide Templates'}
            </Button>
            {this.editor && <UndoRedoManager editor={this.editor} />}
            {this.editor && this.isEmailTemplate && (
              <DeviceManager editor={this.editor} />
            )}

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

              {this.showEditListingsButton && !this.props.isEdit && (
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

              <IconButton
                isFit
                iconSize="large"
                inverse
                onClick={this.props.onClose}
                style={{ marginLeft: '0.5rem' }}
              >
                <CloseIcon />
              </IconButton>
            </Actions>
          </Header>

          <BuilderContainer>
            <TemplatesContainer
              isInvisible={
                this.props.showTemplatesColumn === false ||
                this.state.isTemplatesColumnHidden
              }
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
              {this.isVideoTemplate && this.isTemplateLoaded && (
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
