import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import juice from 'juice'
import { Button, IconButton, Tooltip } from '@material-ui/core'
import { mdiClose, mdiMenu } from '@mdi/js'

import uploadAsset from 'models/instant-marketing/upload-asset'

import { addNotification } from 'components/notification'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { Portal } from 'components/Portal'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import SearchListingDrawer from 'components/SearchListingDrawer'
import TeamAgents from 'components/TeamAgents'
import ImageSelectDialog from 'components/ImageSelectDialog'
import VideoDrawer from 'components/VideoDrawer'
import ArticleDrawer from 'components/ArticleDrawer/ArticleDrawer'
import NeighborhoodsReportDrawer from 'components/NeighborhoodsReportDrawer'

import {
  isAdmin,
  getBrandByType,
  getActiveTeamSettings
} from 'utils/user-teams'
import { loadJS, unloadJS } from 'utils/load-js'
import { ENABLE_MC_LIVEBY_BLOCK_SETTINGS_KEY } from 'constants/user'

import { getBrandFontFamilies } from 'utils/get-brand-fonts'
import { getBrandColors } from 'utils/get-brand-colors'

import { EditorDialog } from 'components/ImageEditor'

import nunjucks from '../helpers/nunjucks'
import getTemplateObject from '../helpers/get-template-object'

import { loadGrapesjs } from './utils/load-grapes'
import { createGrapesInstance } from './utils/create-grapes-instance'

import Templates from '../Templates'
import AddToMarketingCenter from './AddToMarketingCenter'
import { SAVED_TEMPLATE_VARIANT } from './AddToMarketingCenter/constants'
import { VideoToolbar } from './VideoToolbar'
import UndoRedoManager from './UndoRedoManager'
import DeviceManager from './DeviceManager'

import {
  Container,
  Actions,
  TemplatesContainer,
  BuilderContainer,
  Header,
  Divider
} from './styled'

import { BASICS_BLOCK_CATEGORY } from './constants'
import { registerEmailBlocks } from './Blocks/Email'
import { registerSocialBlocks } from './Blocks/Social'
import { removeUnusedBlocks } from './Blocks/Email/utils'
import { getTemplateRenderData } from './utils/get-template-render-data'
import { registerCommands } from './commands'
import { registerToolbarButtons } from './toolbar'

class Builder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      originalTemplate: null,
      selectedTemplate: props.defaultTemplate,
      isLoading: true,
      isEditorLoaded: false,
      isTemplatesColumnHidden: props.isTemplatesColumnHiddenDefault,
      loadedListingsAssets: [],
      isListingDrawerOpen: false,
      isAgentDrawerOpen: false,
      isImageSelectDialogOpen: false,
      imageToEdit: null,
      isVideoDrawerOpen: false,
      isArticleDrawerOpen: false,
      isNeighborhoodsReportDrawerOpen: false,
      isNeighborhoodsGraphsReportDrawerOpen: false
    }

    this.emailBlocksRegistered = false

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

      'mj-image': [
        {
          type: 'text',
          label: 'Link',
          name: 'href'
        }
      ],

      'mj-wrapper': [],

      'mj-social-element': [
        {
          type: 'select',
          label: 'Icon',
          name: 'src',
          options: [
            {
              value: 'https://i.ibb.co/qr5rZym/facebook.png',
              name: 'Facebook'
            },
            {
              value: 'https://i.ibb.co/HC5KTG1/instagram.png',
              name: 'Instagram'
            },
            {
              value: 'https://i.ibb.co/kxjXJ5B/linkedin.png',
              name: 'Linkedin'
            },
            {
              value: 'https://i.ibb.co/7WkrhZV/twitter.png',
              name: 'Twitter'
            },
            {
              value: 'https://i.ibb.co/8jd2Jyc/youtube.png',
              name: 'Youtube'
            }
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
    await this.loadCKEditor()

    const { Grapesjs, GrapesjsMjml } = await loadGrapesjs()

    const { load: loadAssetManagerPlugin } = await import('./AssetManager')
    const { load: loadStyleManagerPlugin } = await import('./StyleManager')

    const brand = getBrandByType(this.props.user, 'Brokerage')
    const brandColors = getBrandColors(brand)
    const brandFonts = getBrandFontFamilies(brand)

    await Promise.all([
      loadAssetManagerPlugin(),
      loadStyleManagerPlugin(brandColors)
    ])

    this.setState({
      isLoading: false
    })

    this.editor = createGrapesInstance(Grapesjs, {
      assets: [...this.props.assets, ...this.userAssets],
      colors: brandColors,
      fontFamilies: brandFonts,
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

    unloadJS('ckeditor')
  }

  loadCKEditor = () => {
    return new Promise(resolve => {
      loadJS('/static/ckeditor/ckeditor.js', 'ckeditor', resolve)
    })
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
    const agentImageAttrKeys = ['profile_image_url', 'cover_image_url']

    agents.forEach(({ agent }) => {
      agentImageAttrKeys
        .filter(attr => agent[attr])
        .forEach(attr => {
          this.editor.AssetManager.add({
            image: agent[attr],
            avatar: true
          })
        })
    })
  }

  setupImageDoubleClickHandler = () => {
    const components = this.editor.DomComponents
    const image = components.getType('image')
    const mjImage = components.getType('mj-image')
    const mjCarouselImage = components.getType('mj-carousel-image')

    const imageComponents = [
      {
        name: 'image',
        component: image
      },
      {
        name: 'mj-image',
        component: mjImage
      },
      {
        name: 'mj-carousel-image',
        component: mjCarouselImage
      }
    ]

    imageComponents.forEach(({ name, component }) => {
      components.addType(name, {
        view: component.view.extend({
          events: {
            dblclick: () => {
              this.setState({ isImageSelectDialogOpen: true })
            }
          }
        })
      })
    })
  }

  setupGrapesJs = () => {
    registerCommands(this.editor)
    registerToolbarButtons(
      this.editor,
      () => {
        this.setState({ isImageSelectDialogOpen: true })
      },
      () => {
        const imageToEdit = `/api/utils/cors/${btoa(
          this.editor.runCommand('get-image')
        )}`

        this.setState({ imageToEdit })
      }
    )
    this.setState({ isEditorLoaded: true })

    this.lockIn()
    this.singleClickTextEditing()
    this.loadTraitsOnSelect()
    this.disableAssetManager()
    this.makeTemplateCentered()
    this.removeTextStylesOnPaste()
    this.disableDefaultDeviceManager()
    this.scrollSidebarToTopOnComponentSelect()

    if (this.isEmailTemplate && this.isMjmlTemplate) {
      this.registerEmailBlocks()
    }

    this.setupImageDoubleClickHandler()

    this.props.onBuilderLoad({
      regenerateTemplate: this.regenerateTemplate
    })
  }

  registerEmailBlocks = () => {
    // We should not re-register blocks if it's already done!
    if (this.emailBlocksRegistered) {
      return
    }

    this.emailBlocksRegistered = true

    const brand = getBrandByType(this.props.user, 'Brokerage')
    const renderData = getTemplateRenderData(brand)

    removeUnusedBlocks(this.editor)

    const emailBlocksOptions = {
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
          this.setState({ isImageSelectDialogOpen: true })
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
    }

    const shouldShowNeighborhoodsBlocks = getActiveTeamSettings(
      this.props.user,
      ENABLE_MC_LIVEBY_BLOCK_SETTINGS_KEY,
      true
    )

    if (shouldShowNeighborhoodsBlocks) {
      emailBlocksOptions.neighborhoods = {
        onNeighborhoodsDrop: () => {
          this.setState({ isNeighborhoodsReportDrawerOpen: true })
        },
        onNeighborhoodsGraphsDrop: () => {
          this.setState({ isNeighborhoodsGraphsReportDrawerOpen: true })
        }
      }
    }

    this.blocks = registerEmailBlocks(
      this.editor,
      renderData,
      emailBlocksOptions
    )
  }

  registerSocialBlocks = () => {
    const brand = getBrandByType(this.props.user, 'Brokerage')
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
        selected.get('type') === 'image' ||
        selected.get('type') === 'mj-image' ||
        selected.get('type') === 'mj-carousel-image'

      if (isImageAsset) {
        return
      }

      if (!selected.view || !selected.view.onActive) {
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

      return
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

      const isEditable = attributes['rechat-editable']
      const isRechatAsset = attributes.hasOwnProperty('rechat-assets')

      if (!isEditable) {
        model.set({
          editable: false,
          resizable: false,
          draggable: false,
          hoverable: isRechatAsset,
          selectable: isRechatAsset
        })
      }

      if (
        shouldSelectImage &&
        attributes['rechat-assets'] === 'listing-image'
      ) {
        shouldSelectImage = false
        this.editor.select(model)
      }

      if (isEditable && isEditable.toLowerCase() === 'tree') {
        return
      }

      model.get('components').each(model => {
        updateAll(model, shouldSelectImage)
      })
    }

    updateAll(this.editor.DomComponents.getWrapper())
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

    this.props.onSave(this.getSavedTemplate(), this.props.templateData.user)

    // We do not want to notify in bareMode or notify for OH mediums
    if (this.shouldNotifyUserAboutSaveInMyDesigns) {
      this.props.notify({
        status: 'success',
        message: 'Saved! You can find it in My Designs section.'
      })
    }
  }

  handleSocialSharing = () => {
    if (!this.isTemplateMarkupRendered()) {
      return
    }

    this.props.onSocialSharing &&
      this.props.onSocialSharing(this.getSavedTemplate())
  }

  handlePrintableSharing = () => {
    if (!this.isTemplateMarkupRendered()) {
      return
    }

    this.props.onPrintableSharing &&
      this.props.onPrintableSharing(this.getSavedTemplate())
  }

  generateBrandedTemplate = (templateMarkup, data) => {
    const brand = getBrandByType(this.props.user, 'Brokerage')
    const renderData = getTemplateRenderData(brand)

    return nunjucks.renderString(templateMarkup, {
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

    let html = selectedTemplate.markup

    // GrapeJS doesn't support inline styles for body tag, we are making our styles
    // inline using juice package. So we need to extract the styles and put them in <head> tag.
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
    this.setEditorTemplateId(getTemplateObject(selectedTemplate).id)
    this.editor.setComponents(html)
    this.lockIn()
    this.deselectAll()
    this.resize()

    if (this.isEmailTemplate && this.isMjmlTemplate) {
      this.registerEmailBlocks()
    }
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

  handleSelectTemplate = templateItem => {
    this.setState(
      {
        originalTemplate: templateItem,
        selectedTemplate: templateItem
      },
      () => {
        this.regenerateTemplate({
          user: this.props.templateData.user
        })
      }
    )
  }

  // This accessor is going to return the template object
  // which contains all templates fields that we need for different things
  // The purpose of this accessor is to return the proper object for
  // both brand templates and template instances (my designs)
  get selectedTemplate() {
    if (!this.state.selectedTemplate) {
      return null
    }

    return getTemplateObject(this.state.selectedTemplate)
  }

  getSavedTemplate() {
    if (this.selectedTemplate.mjml) {
      return this.getMjmlTemplate()
    }

    return this.getHtmlTemplate()
  }

  get isVideoTemplate() {
    return this.selectedTemplate && this.selectedTemplate.video
  }

  get isEmailTemplate() {
    return this.selectedTemplate && this.selectedTemplate.medium === 'Email'
  }

  get isMjmlTemplate() {
    return this.selectedTemplate && this.selectedTemplate.mjml
  }

  get isTemplateLoaded() {
    return this.selectedTemplate && this.selectedTemplate.markup
  }

  get isBareMode() {
    return this.props.bareMode === true
  }

  get shouldShowEditListingsButton() {
    if (this.isBareMode) {
      return false
    }

    return (
      this.state.originalTemplate &&
      this.props.templateTypes.includes('Listings') &&
      this.props.templateData.listings
    )
  }

  get isEmailMedium() {
    if (this.selectedTemplate) {
      return this.selectedTemplate.medium === 'Email'
    }

    return false
  }

  get shouldShowEmailActions() {
    if (this.isBareMode) {
      return false
    }

    return this.isEmailMedium
  }

  get isSocialMedium() {
    if (this.props.templateTypes.includes('CrmOpenHouse')) {
      return false
    }

    if (this.selectedTemplate) {
      return (
        this.selectedTemplate.medium !== 'Email' &&
        this.selectedTemplate.medium !== 'Letter'
      )
    }

    if (this.props.mediums) {
      return this.props.mediums !== 'Email'
    }

    return false
  }

  get shouldShowSocialShareActions() {
    if (this.isBareMode) {
      return false
    }

    return this.isSocialMedium
  }

  get isPrintableMedium() {
    if (this.selectedTemplate) {
      return this.selectedTemplate.medium === 'Letter'
    }

    return false
  }

  get shouldShowPrintableActions() {
    if (this.isBareMode) {
      return false
    }

    return this.isPrintableMedium
  }

  get isOpenHouseMedium() {
    return this.props.templateTypes.includes('CrmOpenHouse')
  }

  get shouldNotifyUserAboutSaveInMyDesigns() {
    if (this.isBareMode || this.isOpenHouseMedium) {
      return false
    }

    return true
  }

  get userAssets() {
    return ['profile_image_url', 'cover_image_url']
      .filter(attr => this.props.user[attr])
      .map(attr => ({
        image: this.props.user[attr],
        avatar: true
      }))
  }

  regenerateTemplate = newData => {
    this.setState(
      state => ({
        selectedTemplate: {
          ...state.selectedTemplate,
          markup: this.generateBrandedTemplate(state.originalTemplate.markup, {
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

  toggleTemplatesColumnVisibility = () => {
    this.setState(prevState => ({
      ...prevState,
      isTemplatesColumnHidden: !prevState.isTemplatesColumnHidden
    }))
  }

  shouldShowSaveAsTemplateButton = () => {
    if (this.isBareMode) {
      return false
    }

    // Only admin users should see this for now
    const isAdminUser = isAdmin(this.props.user)

    return isAdminUser && this.state.selectedTemplate && !this.isOpenHouseMedium
  }

  isTemplatesListEnabled = () => {
    if (this.props.hideTemplatesColumn) {
      return false
    }

    if (
      this.selectedTemplate &&
      this.selectedTemplate.variant === SAVED_TEMPLATE_VARIANT
    ) {
      return false
    }

    return true
  }

  render() {
    if (this.state.isLoading) {
      return null
    }

    return (
      <Portal root="marketing-center">
        <Container
          hideBlocks={!this.isMjmlTemplate}
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
          {this.state.isImageSelectDialogOpen && (
            <ImageSelectDialog
              onClose={() => {
                this.blocks &&
                  this.blocks.image &&
                  this.blocks.image.selectHandler()
                this.setState({ isImageSelectDialogOpen: false })
              }}
              onSelect={imageUrl => {
                if (
                  !this.blocks ||
                  !this.blocks.image ||
                  !this.blocks.image.selectHandler(imageUrl)
                ) {
                  this.editor.runCommand('set-image', {
                    value: imageUrl
                  })
                }

                this.setState({ isImageSelectDialogOpen: false })
              }}
              onUpload={async file => {
                const templateId = this.selectedTemplate.id
                const uploadedAsset = await uploadAsset(file, templateId)

                return uploadedAsset.file.url
              }}
            />
          )}
          {this.state.imageToEdit && (
            <EditorDialog
              file={this.state.imageToEdit}
              onClose={() => {
                this.setState({ imageToEdit: null })
              }}
              onSave={async file => {
                const templateId = this.selectedTemplate.id
                const uploadedAsset = await uploadAsset(file, templateId)

                this.editor.runCommand('set-image', {
                  value: uploadedAsset.file.url
                })
                this.setState({ imageToEdit: null })
              }}
            />
          )}
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
          {this.blocks && this.blocks.neighborhoods && (
            <NeighborhoodsReportDrawer
              isOpen={
                this.state.isNeighborhoodsReportDrawerOpen ||
                this.state.isNeighborhoodsGraphsReportDrawerOpen
              }
              onlyAggregatedReports={
                this.state.isNeighborhoodsGraphsReportDrawerOpen
              }
              onClose={() => {
                this.setState({
                  isNeighborhoodsReportDrawerOpen: false,
                  isNeighborhoodsGraphsReportDrawerOpen: false
                })
              }}
              onSelect={report => {
                this.blocks.neighborhoods.selectHandler(report)
                this.setState({
                  isNeighborhoodsReportDrawerOpen: false,
                  isNeighborhoodsGraphsReportDrawerOpen: false
                })
              }}
            />
          )}
          <Header>
            {this.isTemplatesListEnabled() && (
              <>
                <Tooltip
                  title={
                    this.state.isTemplatesColumnHidden
                      ? 'Change Template'
                      : 'Hide Templates'
                  }
                >
                  <IconButton onClick={this.toggleTemplatesColumnVisibility}>
                    <SvgIcon path={mdiMenu} />
                  </IconButton>
                </Tooltip>

                <Divider orientation="vertical" />
              </>
            )}

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

            <Actions>
              {this.shouldShowSaveAsTemplateButton() && (
                <AddToMarketingCenter
                  medium={this.selectedTemplate.medium}
                  inputs={this.selectedTemplate.inputs}
                  mjml={this.selectedTemplate.mjml}
                  user={this.props.user}
                  getTemplateMarkup={this.getTemplateMarkup.bind(this)}
                />
              )}

              {this.shouldShowEditListingsButton && !this.props.isEdit && (
                <Button
                  style={{ marginLeft: '0.5rem' }}
                  variant="outlined"
                  color="secondary"
                  onClick={this.props.onShowEditListings}
                >
                  Edit Listings ({this.props.templateData.listings.length})
                </Button>
              )}

              {(this.shouldShowPrintableActions ||
                this.shouldShowSocialShareActions) && (
                <Button
                  style={{
                    marginLeft: '0.5rem'
                  }}
                  variant="contained"
                  color="primary"
                  onClick={this.handleSocialSharing}
                >
                  Continue
                </Button>
              )}

              {this.shouldShowEmailActions && (
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

              {this.isBareMode && (
                <Button
                  style={{
                    marginLeft: '0.5rem'
                  }}
                  variant="contained"
                  color="primary"
                  onClick={this.handleSave}
                >
                  {this.props.saveButtonText || 'Save'}
                </Button>
              )}

              <IconButton
                onClick={this.props.onClose}
                style={{ marginLeft: '0.5rem' }}
              >
                <SvgIcon path={mdiClose} />
              </IconButton>
            </Actions>
          </Header>

          <BuilderContainer>
            <TemplatesContainer
              isInvisible={
                !this.isTemplatesListEnabled() ||
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

export default connect(mapStateToProps, { notify: addNotification })(Builder)
