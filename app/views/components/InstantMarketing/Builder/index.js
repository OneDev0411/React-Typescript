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
import { TeamAgentsDrawer } from 'components/TeamAgentsDrawer'
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

import { getBrandFontFamilies } from 'utils/get-brand-fonts'
import { getBrandColors } from 'utils/get-brand-colors'

import { EditorDialog } from 'components/ImageEditor'

import MatterportDrawer from 'components/MatterportDrawer'

import MapDrawer from 'components/MapDrawer'

import CarouselDrawer from 'components/CarouselDrawer'

import nunjucks from '../helpers/nunjucks'
import getTemplateObject from '../helpers/get-template-object'

import { loadGrapesjs } from './utils/load-grapes'
import { createGrapesInstance } from './utils/create-grapes-instance'
import { attachCKEditor } from './utils/ckeditor'

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
import {
  getTemplateBlockOptions,
  getTemplateExtraTextEditorFonts
} from './Blocks/templateBlocks'
import { getTemplateRenderData } from './utils/get-template-render-data'
import { registerWebsiteBlocks, websiteBlocksTraits } from './Blocks/Website'
import { registerCommands } from './commands'
import { registerToolbarButtons } from './toolbar'
import {
  makeParentDependentsHidden,
  makeParentDependentsVisible,
  removeDirectDependents
} from './utils/dependent-components'
import { makeModelUndraggable } from './utils/models'

class Builder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      originalTemplate: null,
      selectedTemplate: props.defaultTemplate,
      extraTextEditorFonts: [],
      isLoading: true,
      isEditorLoaded: false,
      isTemplatesColumnHidden: props.isTemplatesColumnHiddenDefault,
      loadedListingsAssets: [],
      isListingDrawerOpen: false,
      isAgentDrawerOpen: false,
      isImageSelectDialogOpen: false,
      imageToEdit: null,
      isArticleDrawerOpen: false,
      isNeighborhoodsReportDrawerOpen: false,
      isNeighborhoodsGraphsReportDrawerOpen: false,
      mapToEdit: null,
      carouselToEdit: null,
      videoToEdit: null,
      matterportToEdit: null
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
      ],

      ...websiteBlocksTraits
    }
  }

  async componentDidMount() {
    await this.loadCKEditor()

    const { Grapesjs, GrapesjsMjml } = await loadGrapesjs()

    const { load: loadAssetManagerPlugin } = await import('./AssetManager')
    const { load: loadStyleManagerPlugin } = await import('./StyleManager')

    const brand = getBrandByType(this.props.user, 'Brokerage')
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
      plugins: this.isWebsiteTemplate ? [] : [GrapesjsMjml],
      pluginsOpts: {
        [GrapesjsMjml]: {
          columnsPadding: false,
          categoryLabel: BASICS_BLOCK_CATEGORY
        }
      },
      detectComponentByType: this.isWebsiteTemplate
    })

    await this.loadCKEditorRTE()
    this.initLoadedListingsAssets()

    this.editor.on('load', this.setupGrapesJs)
    this.editor.on('rte:enable', this.evaluateRte)

    this.makeAllComponentsUndraggable()
  }

  componentWillUnmount() {
    if (this.editor) {
      const iframe = this.editor.Canvas.getBody()

      iframe.removeEventListener('paste', this.iframePasteHandler)
    }

    unloadJS('ckeditor')
  }

  evaluateRte = (view, rte) => {
    /*
     * Some clients (looking at you DE) want certain parts of their templates
     * to be editable, but without the ckeditor. Only inline editing.
     *
     * So in our templates we added an optional tag: rte=disable in an element means
     * we'll hide the rte for that element and its children
     *
     * The way we achieve this is this: When rte gets enabled, rte:enable event
     * will be fired. Then, we'll come and traverse the tree to see if we can find
     * the rte=disable tag.
     * If no, then all is good. If we find it, we need to hide the ckeditor.
     *
     * The way we can achieve that is by adding display: none to it's element.
     * The only problem is that at the time this function gets called, the
     * rte instance may not be initialized yet. So there wont be any element
     * to hide.
     *
     * In that case, we'll listen to instanceReady and hide the element once
     * the instance becomes ready.
     */
    let model = view.model

    const hide = rte => {
      rte.once('instanceReady', () => {
        rte.ui.space('top')?.setStyle('display', 'none')

        rte.once('focus', () => {
          rte.ui.space('top')?.setStyle('display', 'none')
        })
      })
    }

    do {
      if (model.attributes.attributes.rte === 'disable') {
        hide(rte)
        break
      }
      // eslint-disable-next-line no-cond-assign
    } while ((model = model.parent()))
  }

  loadTemplateExtraTextEditorFonts = async () => {
    if (!this.selectedTemplate) {
      this.setState({ extraTextEditorFonts: [] })

      return
    }

    const extraTextEditorFonts = await getTemplateExtraTextEditorFonts(
      this.selectedTemplate
    )

    this.setState({ extraTextEditorFonts })
  }

  loadCKEditor = () => {
    return new Promise(resolve => {
      loadJS('/static/ckeditor/ckeditor.js', 'ckeditor', resolve)
    })
  }

  loadCKEditorRTE = () => {
    const brand = getBrandByType(this.props.user, 'Brokerage')
    const brandColors = getBrandColors(brand)
    const brandFonts = getBrandFontFamilies(brand)

    return attachCKEditor(
      this.editor,
      brandFonts,
      brandColors,
      undefined,
      opts => {
        const currentFonts = opts.font_names ? opts.font_names.split(';') : []
        const allFonts = [...currentFonts, ...this.state.extraTextEditorFonts]

        return {
          font_names: allFonts.join(';')
        }
      }
    )
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
    const imageBg = components.getType('image-bg')
    const mjImage = components.getType('mj-image')
    const mjCarouselImage = components.getType('mj-carousel-image')

    const imageComponents = [
      {
        name: 'image',
        component: image
      },
      {
        name: 'image-bg',
        component: imageBg
      },
      {
        name: 'mj-image',
        component: mjImage
      },
      {
        name: 'mj-carousel-image',
        component: mjCarouselImage
      }
    ].filter(image => !!image.component)

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

  setupGrapesJs = async () => {
    registerCommands(this.editor)
    registerToolbarButtons(this.editor, {
      onChangeImageClick: () => {
        this.setState({ isImageSelectDialogOpen: true })
      },
      onEditImageClick: () => {
        const imageToEdit = `/api/utils/cors/${btoa(
          this.editor.runCommand('get-image')
        )}`

        this.setState({ imageToEdit })
      },
      onChangeThemeClick: this.openMapDrawer,
      onManageCarouselClick: this.openCarouselDrawer
    })
    this.setState({ isEditorLoaded: true })

    this.lockIn()
    this.makeAllComponentsUndraggable()
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

    if (this.isWebsiteTemplate) {
      await this.registerWebsiteBlocks()
    }

    this.setupImageDoubleClickHandler()

    this.setupDependentComponents()

    this.props.onBuilderLoad({
      regenerateTemplate: this.regenerateTemplate
    })
  }

  getBlocksOptions() {
    const blocksOptions = {
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
        onDrop: this.openVideoDrawer
      },
      article: {
        onDrop: () => {
          this.setState({ isArticleDrawerOpen: true })
        }
      }
    }

    const activeTeamSettings = getActiveTeamSettings(this.props.user, true)

    const { enable_liveby: shouldShowNeighborhoodsBlocks } = activeTeamSettings

    if (shouldShowNeighborhoodsBlocks) {
      blocksOptions.neighborhoods = {
        onNeighborhoodsDrop: () => {
          this.setState({ isNeighborhoodsReportDrawerOpen: true })
        },
        onNeighborhoodsGraphsDrop: () => {
          this.setState({ isNeighborhoodsGraphsReportDrawerOpen: true })
        }
      }
    }

    return blocksOptions
  }

  async registerEmailBlocks() {
    // We should not re-register blocks if it's already done!
    if (this.emailBlocksRegistered) {
      return
    }

    this.emailBlocksRegistered = true

    const brand = getBrandByType(this.props.user, 'Brokerage')
    const renderData = getTemplateRenderData(brand)

    removeUnusedBlocks(this.editor)

    const emailBlocksOptions = this.getBlocksOptions()

    const templateBlockOptions = await getTemplateBlockOptions(
      this.selectedTemplate
    )

    this.blocks = registerEmailBlocks(
      this.editor,
      {
        ...this.props.templateData,
        ...renderData
      },
      templateBlockOptions,
      emailBlocksOptions
    )
  }

  async registerSocialBlocks() {
    const brand = getBrandByType(this.props.user, 'Brokerage')
    const renderData = getTemplateRenderData(brand)

    const templateBlockOptions = await getTemplateBlockOptions(
      this.selectedTemplate
    )

    removeUnusedBlocks(this.editor)
    this.blocks = registerSocialBlocks(
      this.editor,
      {
        ...this.props.templateData,
        ...renderData
      },
      templateBlockOptions
    )
  }

  async registerWebsiteBlocks() {
    // We should not re-register blocks if it's already done!
    if (this.websiteBlocksRegistered) {
      return
    }

    this.websiteBlocksRegistered = true

    const brand = getBrandByType(this.props.user, 'Brokerage')
    const renderData = getTemplateRenderData(brand)

    const dynamicBlocksOptions = this.getBlocksOptions()
    const blocksOptions = {
      onVideoDrop: dynamicBlocksOptions.video.onDrop,
      onImageDrop: dynamicBlocksOptions.image.onDrop,
      onAgentDrop: dynamicBlocksOptions.agent.onDrop,
      onArticleDrop: dynamicBlocksOptions.article.onDrop,
      onMatterportDrop: this.openMatterportDrawer,
      onMatterportDoubleClick: this.openMatterportDrawer,
      onEmptyMatterportClick: this.openMatterportDrawer,
      onMapDrop: this.openMapDrawer,
      onMapDoubleClick: this.openMapDrawer,
      onCarouselDrop: this.openCarouselDrawer,
      onCarouselDoubleClick: this.openCarouselDrawer,
      onVideoDoubleClick: this.openVideoDrawer,
      onEmptyVideoClick: this.openVideoDrawer
    }

    const templateBlockOptions = await getTemplateBlockOptions(
      this.selectedTemplate
    )

    this.blocks = registerWebsiteBlocks(
      this.editor,
      {
        ...this.props.templateData,
        ...renderData
      },
      templateBlockOptions,
      blocksOptions
    )
  }

  setupDependentComponents = () => {
    this.editor.on('component:remove', model => {
      // Remove the direct dependent models
      removeDirectDependents(this.editor, model)

      // Hide the parent dependents if this model is the last children
      makeParentDependentsHidden(this.editor, model.parent())
    })

    this.editor.on('component:mount', model => {
      makeParentDependentsVisible(this.editor, model.parent())
    })

    let dragStartParentModel = null

    this.editor.on('component:drag:start', event => {
      dragStartParentModel = event.parent
    })

    this.editor.on('component:drag:end', event => {
      if (event.parent !== dragStartParentModel) {
        makeParentDependentsHidden(this.editor, dragStartParentModel)

        // We don't need the below line because the mount event happens on dropping
        // makeParentDependentsVisible(this.editor, event.parent)
      }

      dragStartParentModel = null
    })
  }

  makeAllComponentsUndraggable = () => {
    // Make all the models undraggable on template initialize phase
    makeModelUndraggable(this.editor.DomComponents.getWrapper())
  }

  openCarouselDrawer = model => {
    this.setState({ carouselToEdit: model })
  }

  openMapDrawer = model => {
    this.setState({ mapToEdit: model })
  }

  openVideoDrawer = model => {
    this.setState({ videoToEdit: model })
  }

  openMatterportDrawer = model => {
    this.setState({ matterportToEdit: model })
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

    config.avoidInlineStyle = false
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
    this.makeAllComponentsUndraggable()
    this.deselectAll()
    this.resize()

    if (this.isEmailTemplate && this.isMjmlTemplate) {
      this.registerEmailBlocks()
    } else if (this.isWebsiteTemplate) {
      this.registerWebsiteBlocks()
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

  get isWebsiteTemplate() {
    return this.selectedTemplate && this.selectedTemplate.medium === 'Website'
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
      async () => {
        this.refreshEditor(this.state.selectedTemplate)
        await this.loadTemplateExtraTextEditorFonts()
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

  get hasBlocks() {
    return this.isMjmlTemplate || this.isWebsiteTemplate
  }

  uploadFile = async file => {
    const templateId = this.selectedTemplate.id
    const uploadedAsset = await uploadAsset(file, templateId)

    return uploadedAsset.file.url
  }

  getSaveButton() {
    const saveButton = (
      <Button
        style={{
          marginLeft: '0.5rem'
        }}
        variant="contained"
        color="primary"
        onClick={this.handleSave}
        disabled={this.props.actionButtonsDisabled}
        startIcon={this.props.saveButtonStartIcon}
      >
        {this.isBareMode ? this.props.saveButtonText || 'Save' : 'Continue'}
      </Button>
    )

    return this.props.saveButtonWrapper
      ? this.props.saveButtonWrapper(saveButton)
      : saveButton
  }

  render() {
    if (this.state.isLoading) {
      return null
    }

    return (
      <Portal root="marketing-center">
        <Container
          hideBlocks={!this.hasBlocks}
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
            <TeamAgentsDrawer
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
                this.blocks?.image?.selectHandler()

                this.setState({ isImageSelectDialogOpen: false })
              }}
              onSelect={imageUrl => {
                if (!this.blocks?.image?.selectHandler(imageUrl)) {
                  this.editor.runCommand('set-image', {
                    value: imageUrl
                  })
                }

                this.setState({ isImageSelectDialogOpen: false })
              }}
              onUpload={this.uploadFile}
            />
          )}
          {this.state.imageToEdit && (
            <EditorDialog
              file={this.state.imageToEdit}
              dimensions={
                this.editor.runCommand('get-el')
                  ? [
                      this.editor.runCommand('get-el').clientWidth * 2,
                      this.editor.runCommand('get-el').clientHeight * 2
                    ]
                  : undefined
              }
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
            isOpen={!!this.state.videoToEdit}
            video={this.state.videoToEdit}
            onClose={() => {
              this.blocks.video.selectHandler()
              this.setState({ videoToEdit: null })
            }}
            onSelect={video => {
              this.blocks.video.selectHandler(video)
              this.setState({ videoToEdit: null })
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
          <MatterportDrawer
            isOpen={!!this.state.matterportToEdit}
            matterport={this.state.matterportToEdit}
            onClose={() => {
              this.blocks.matterport.selectHandler()
              this.setState({ matterportToEdit: null })
            }}
            onSelect={matterportModelId => {
              this.blocks.matterport.selectHandler(matterportModelId)
              this.setState({ matterportToEdit: null })
            }}
          />
          <MapDrawer
            isOpen={!!this.state.mapToEdit}
            map={this.state.mapToEdit}
            initialCenter={
              this.props.templateData.listing?.property.address.location
            }
            onClose={() => {
              this.setState({ mapToEdit: null })
            }}
            onSelect={(...args) => {
              this.blocks.map.selectHandler(...args)
              this.setState({ mapToEdit: null })
            }}
          />
          <CarouselDrawer
            isOpen={!!this.state.carouselToEdit}
            carousel={this.state.carouselToEdit}
            initialCenter={
              this.props.templateData.listing?.property.address.location
            }
            onClose={() => {
              this.setState({ carouselToEdit: null })
            }}
            onSelect={(...args) => {
              this.blocks.carousel.selectHandler(...args)
              this.setState({ carouselToEdit: null })
            }}
            suggestedImages={
              this.props.templateData.listing?.gallery_image_urls
            }
            onImageUpload={this.uploadFile}
          />
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
              {this.props.customActions}

              {this.shouldShowSaveAsTemplateButton() && (
                <AddToMarketingCenter
                  medium={this.selectedTemplate.medium}
                  inputs={this.selectedTemplate.inputs}
                  mjml={this.selectedTemplate.mjml}
                  user={this.props.user}
                  getTemplateMarkup={this.getTemplateMarkup.bind(this)}
                  disabled={this.props.actionButtonsDisabled}
                />
              )}

              {this.shouldShowEditListingsButton && !this.props.isEdit && (
                <Button
                  style={{ marginLeft: '0.5rem' }}
                  variant="outlined"
                  color="secondary"
                  onClick={this.props.onShowEditListings}
                  disabled={this.props.actionButtonsDisabled}
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
                  disabled={this.props.actionButtonsDisabled}
                >
                  Continue
                </Button>
              )}

              {(this.shouldShowEmailActions || this.isBareMode) &&
                this.getSaveButton()}

              <IconButton
                onClick={this.props.onClose}
                style={{ marginLeft: '0.5rem' }}
                disabled={this.props.actionButtonsDisabled}
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
