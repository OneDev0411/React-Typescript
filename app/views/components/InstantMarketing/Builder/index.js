import { ACL } from 'constants/acl'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import juice from 'juice'
import { Button, IconButton, Tooltip } from '@material-ui/core'

import { Portal } from 'components/Portal'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import IconMenu from 'components/SvgIcons/Menu/IconMenu'
import SearchListingDrawer from 'components/SearchListingDrawer'
import TeamAgents from 'components/TeamAgents'
import ImageDrawer from 'components/ImageDrawer'
import GifDrawer from 'components/GifDrawer'
import VideoDrawer from 'components/VideoDrawer'
import ArticleDrawer from 'components/ArticleDrawer/ArticleDrawer'

import { getActiveTeam, hasUserAccess } from 'utils/user-teams'

import nunjucks from '../helpers/nunjucks'
import { getBrandColors } from '../helpers/get-brand-colors'

import { loadGrapesjs } from './utils/load-grapes'
import { createGrapesInstance } from './utils/create-grapes-instance'

import Templates from '../Templates'
import AddToMarketingCenter from './AddToMarketingCenter'
import { VideoToolbar } from './VideoToolbar'
import UndoRedoManager from './UndoRedoManager'
import DeviceManager from './DeviceManager'
import { TeamSelector } from './TeamSelector'
import { createRichTextEditor } from './RichTextEditor'

import {
  Container,
  Actions,
  TemplatesContainer,
  BuilderContainer,
  Header,
  Divider
} from './styled'

import SocialActions from './SocialActions'
import { SOCIAL_NETWORKS, BASICS_BLOCK_CATEGORY } from './constants'
import { registerEmailBlocks } from './Blocks/Email'
import { registerSocialBlocks } from './Blocks/Social'
import { removeUnusedBlocks } from './Blocks/Email/utils'
import getTemplateRenderData from './utils/get-template-render-data'

const ENABLE_CUSTOM_RTE = false

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
      isTemplatesColumnHidden: true,
      loadedListingsAssets: [],
      isListingDrawerOpen: false,
      isAgentDrawerOpen: false,
      isImageDrawerOpen: false,
      isGifDrawerOpen: false,
      isVideoDrawerOpen: false,
      isArticleDrawerOpen: false
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

      'mj-wrapper': [],

      'mj-social-element': [
        {
          type: 'select',
          label: 'Icon',
          name: 'name',
          options: [
            { value: 'linkedin', name: 'Linkedin' },
            { value: 'facebook', name: 'Facebook' },
            { value: 'instagram', name: 'Instagram' },
            { value: 'twitter', name: 'Twitter' },
            { value: 'web', name: 'Web' },
            { value: 'youtube', name: 'Youtube' },
            { value: 'pinterest', name: 'Pinterest' },
            { value: 'snapchat', name: 'Snapchat' },
            { value: 'vimeo', name: 'Vimeo' },
            { value: 'tumblr', name: 'Tumblr' },
            { value: 'soundcloud', name: 'SoundCloud' },
            { value: 'medium', name: 'Medium' }
          ]
        },
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

  addAgentAssets = agents => {
    this.editor.AssetManager.add(
      agents.map(({ agent }) => {
        return ['profile_image_url', 'cover_image_url']
          .filter(attr => agent[attr])
          .map(attr => ({
            image: agent[attr],
            avatar: true
          }))
      })
    )
  }

  setRte = () => {
    const { enable, disable } = createRichTextEditor(this.editor)

    this.editor.setCustomRte({
      enable,
      disable
    })
  }

  setupGrapesJs = () => {
    this.setState({ isEditorLoaded: true })

    this.lockIn()
    this.singleClickTextEditing()
    this.loadTraitsOnSelect()
    this.disableAssetManager()
    this.makeTemplateCentered()
    this.removeTextStylesOnPaste()
    this.disableDefaultDeviceManager()
    this.scrollSidebarToTopOnComponentSelect()

    if (ENABLE_CUSTOM_RTE) {
      this.setRte()
    }

    if (this.isEmailTemplate && this.isMjmlTemplate) {
      this.registerEmailBlocks()
    }

    this.props.onBuilderLoad({
      regenerateTemplate: this.regenerateTemplate
    })
  }

  registerEmailBlocks = () => {
    const { brand } = getActiveTeam(this.props.user)
    const renderData = getTemplateRenderData(brand)

    removeUnusedBlocks(this.editor)
    this.blocks = registerEmailBlocks(this.editor, renderData, {
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
      },
      article: {
        onDrop: () => {
          this.setState({ isArticleDrawerOpen: true })
        }
      }
    })
  }

  registerSocialBlocks = () => {
    const { brand } = getActiveTeam(this.props.user)
    const renderData = getTemplateRenderData(brand)

    removeUnusedBlocks(this.editor)
    this.blocks = registerSocialBlocks(this.editor, renderData)
  }

  disableAssetManager = () => {
    this.editor.on('run:open-assets', () => this.editor.Modal.close())
  }

  disableDefaultDeviceManager = () => {
    this.editor.Panels.removePanel('devices-c')
  }

  singleClickTextEditing = () => {
    this.editor.on('component:selected', selected => {
      const isImageAsset =
        selected.get('type') === 'image' || selected.get('type') === 'mj-image'

      if (!selected.view.onActive || isImageAsset) {
        return
      }

      try {
        selected.view.onActive(selected.view.el)
      } catch (err) {
        // pass for now :(
        // Uncaught TypeError: Cannot read property 'tagName' of null
      }
    })
  }

  loadTraitsOnSelect = () => {
    this.editor.on('component:selected', selected => {
      this.setTraits(selected)
    })
  }

  scrollSidebarToTopOnComponentSelect = () => {
    const rightPanelElem = document.querySelector('.gjs-pn-views-container')

    this.editor.on('component:selected', () => {
      rightPanelElem.scrollTop = 0
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

      const editable = attributes['rechat-editable']
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

      if (editable && editable.toLowerCase() === 'tree') {
        return
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

    // We should always inlinify templates to prevent future conflicts between props in edit mode.
    // An example case is this issue: https://gitlab.com/rechat/web/issues/3769
    // The reason was we set 2 bg images for the element. An inline one and another with selector.
    const result = juice(assembled)

    return {
      ...this.state.selectedTemplate,
      result
    }
  }

  getTemplateMarkup() {
    return this.getSavedTemplate().result
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
    const config = this.editor.getConfig()

    config.avoidInlineStyle = !this.isMjmlTemplate
    config.forceClass = !this.isMjmlTemplate

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
    this.deselectAll()
    this.setState({
      templateHtmlCss: this.getTemplateHtmlCss()
    })
    this.resize()
  }

  deselectAll = () => {
    this.editor.selectRemove(this.editor.getSelectedAll())
  }

  resize = () => {
    const canvas = this.editor.Canvas.getBody()
    const viewport = document.querySelector('.gjs-cv-canvas')

    const {
      width: canvasWidth,
      height: canvasHeight
    } = canvas.getBoundingClientRect()

    const {
      width: viewportWidth,
      height: viewportHeight
    } = viewport.getBoundingClientRect()

    let scale = 1

    if (canvasWidth >= canvasHeight) {
      if (canvasWidth > viewportWidth) {
        scale = viewportWidth / canvasWidth
      }
    } else if (canvasHeight > viewportHeight) {
      scale = viewportHeight > canvasHeight
    }

    if (scale === 1) {
      canvas.style.transform = ''
      canvas.style.transformOrigin = ''
    } else {
      canvas.style.transform = `scale(${scale})`
      canvas.style.transformOrigin = 'left top'
    }
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

  handleOwnerChange = owner => {
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
    return (
      this.state.selectedTemplate &&
      this.state.selectedTemplate.medium === 'Email'
    )
  }

  get isMjmlTemplate() {
    return this.state.selectedTemplate && this.state.selectedTemplate.mjml
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

  get isOpenHouseMedium() {
    return this.props.templateTypes.includes('CrmOpenHouse')
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

  shouldShowSaveAsTemplateButton = () => {
    return this.state.selectedTemplate && !this.isOpenHouseMedium
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
          hideBlocks={
            !this.isMjmlTemplate ||
            this.isOpenHouseMedium ||
            this.isSocialMedium ||
            hasUserAccess(this.props.user, ACL.BETA) === false
          }
          className="template-builder"
          style={this.props.containerStyle}
        >
          {this.state.isListingDrawerOpen && (
            <SearchListingDrawer
              mockListings
              multipleSelection
              isOpen
              title="Select Listing"
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
          )}
          {this.state.isAgentDrawerOpen && (
            <TeamAgents
              isPrimaryAgent
              multiSelection
              user={this.props.user}
              title="Select Agents"
              onClose={() => {
                this.blocks.agent.selectHandler()
                this.setState({ isAgentDrawerOpen: false })
              }}
              onSelectAgents={agents => {
                this.addAgentAssets(agents)
                this.blocks.agent.selectHandler(agents)
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
          <ArticleDrawer
            isOpen={this.state.isArticleDrawerOpen}
            onClose={() => {
              this.blocks.article.selectHandler()
              this.setState({ isArticleDrawerOpen: false })
            }}
            onSelect={article => {
              this.blocks.article.selectHandler(article)
              this.setState({ isArticleDrawerOpen: false })
            }}
          />
          <Header>
            <Tooltip
              title={
                this.state.isTemplatesColumnHidden
                  ? 'Change Template'
                  : 'Hide Templates'
              }
            >
              <IconButton onClick={this.toggeleTemplatesColumnVisibility}>
                <IconMenu />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" />

            {this.editor && (
              <>
                <UndoRedoManager editor={this.editor} />
                <Divider orientation="vertical" />
              </>
            )}

            {this.editor && this.isEmailTemplate && (
              <>
                <DeviceManager editor={this.editor} />
                <Divider orientation="vertical" />
              </>
            )}

            {this.state.selectedTemplate && (
              <TeamSelector
                templateData={this.props.templateData}
                owner={this.state.owner}
                onSelect={this.handleOwnerChange}
              />
            )}

            <Actions>
              {this.shouldShowSaveAsTemplateButton() && (
                <AddToMarketingCenter
                  medium={this.state.selectedTemplate.medium}
                  inputs={this.state.selectedTemplate.inputs}
                  mjml={this.state.selectedTemplate.mjml}
                  user={this.props.user}
                  getTemplateMarkup={this.getTemplateMarkup.bind(this)}
                />
              )}

              {this.ShowEditListingsButton && !this.props.isEdit && (
                <Button
                  style={{ marginLeft: '0.5rem' }}
                  variant="outlined"
                  color="secondary"
                  onClick={this.props.onShowEditListings}
                >
                  Edit Listings ({this.props.templateData.listings.length})
                </Button>
              )}

              {this.state.selectedTemplate && isSocialMedium && (
                <SocialActions
                  networks={socialNetworks}
                  onClick={this.handleSocialSharing}
                />
              )}

              {this.state.selectedTemplate && !isSocialMedium && (
                <Button
                  style={{
                    marginLeft: '0.5rem'
                  }}
                  variant="contained"
                  color="primary"
                  onClick={this.handleSave}
                >
                  Continue
                </Button>
              )}

              <IconButton
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
