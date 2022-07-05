import React from 'react'

import { Button, IconButton, Tooltip } from '@material-ui/core'
import { mdiClose, mdiMenu } from '@mdi/js'
import juice from 'juice'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  selectActiveBrand,
  selectActiveBrandSettings
} from '@app/selectors/brand'
import { selectActiveTeamUnsafe } from '@app/selectors/team'
import SearchArticleDrawer from '@app/views/components/SearchArticleDrawer'
import SearchVideoDrawer from '@app/views/components/SearchVideoDrawer'
import CarouselDrawer from 'components/CarouselDrawer'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { EditorDialog } from 'components/ImageEditor'
import ImageSelectDialog from 'components/ImageSelectDialog'
import { PLACEHOLDER_IMAGE_URL } from 'components/InstantMarketing/constants'
import { getHipPocketTemplateImagesUploader } from 'components/InstantMarketing/helpers/get-hip-pocket-template-image-uploader'
import { getMlsDrawerInitialDeals } from 'components/InstantMarketing/helpers/get-mls-drawer-initial-deals'
import MapDrawer from 'components/MapDrawer'
import MatterportDrawer from 'components/MatterportDrawer'
import NeighborhoodsReportDrawer from 'components/NeighborhoodsReportDrawer'
import { addNotification } from 'components/notification'
import { Portal } from 'components/Portal'
import SearchListingDrawer from 'components/SearchListingDrawer'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TeamAgentsDrawer } from 'components/TeamAgentsDrawer'
import { uploadAsset } from 'models/instant-marketing/upload-asset'
import { getBrandListings } from 'models/listings/search/get-brand-listings'
import { isAdmin } from 'utils/acl'
import { getArrayWithFallbackAccessor } from 'utils/get-array-with-fallback-accessor'
import { getBrandColors } from 'utils/get-brand-colors'
import { loadJS, unloadJS } from 'utils/load-js'

import {
  hasCreateSuperCampaignButton,
  hasSaveAsTemplateButton
} from '../helpers/builder-actions'
import getTemplateObject from '../helpers/get-template-object'
import nunjucks from '../helpers/nunjucks'
import Templates from '../Templates'

import { AddToMarketingCenterButton } from './AddToMarketingCenterButton'
import { SAVED_TEMPLATE_VARIANT } from './AddToMarketingCenterButton/constants'
import { registerEmailBlocks } from './Blocks/Email'
import { removeUnusedBlocks } from './Blocks/Email/utils'
import { registerSocialBlocks } from './Blocks/Social'
import {
  getTemplateBlockOptions,
  getTemplateOptions
} from './Blocks/templateBlocks'
import { registerWebsiteBlocks, websiteBlocksTraits } from './Blocks/Website'
import { registerCommands } from './commands'
import { BASICS_BLOCK_CATEGORY } from './constants'
import CreateSuperCampaignButton from './CreateSuperCampaignButton'
import DeviceManager from './DeviceManager'
import { addFallbackSrcToImage } from './extensions/add-fallback-src-to-image'
import { addFallbackSrcToMjImage } from './extensions/add-fallback-src-to-mj-image'
import { patchConditionalToolbarButtonsIssue } from './extensions/patch-conditional-toolbar-buttons-issue'
import {
  Container,
  Actions,
  TemplatesContainer,
  BuilderContainer,
  Header,
  Divider
} from './styled'
import { registerToolbarButtons } from './toolbar'
import UndoRedoManager from './UndoRedoManager'
import { attachCKEditor } from './utils/ckeditor'
import { createGrapesInstance } from './utils/create-grapes-instance'
import {
  makeParentDependentsHidden,
  makeParentDependentsVisible,
  removeDirectDependents
} from './utils/dependent-components'
import { getTemplateRenderData } from './utils/get-template-render-data'
import { loadGrapesjs } from './utils/load-grapes'
import { VideoToolbar } from './VideoToolbar'

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
      listingDrawerListings: [],
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

    this.selectedTemplateOptions = null
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
              value: '',
              name: '-- Select icon --'
            },
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
    await this.loadTemplateOptions()

    const { Grapesjs, GrapesjsMjml } = await loadGrapesjs()

    const { load: loadAssetManagerPlugin } = await import('./AssetManager')
    const { load: loadStyleManagerPlugin } = await import('./StyleManager')

    const activeBrand = this.props.activeBrand
    const colors =
      this.selectedTemplateColors.length > 0
        ? this.selectedTemplateColors
        : getBrandColors(activeBrand)

    await Promise.all([
      loadAssetManagerPlugin(),
      loadStyleManagerPlugin(colors)
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
    this.editor.on('frame:load:before', this.setCanvasModeToStandardHTML5)

    try {
      const listingDrawerListings = await getBrandListings(
        this.props.activeBrand.id
      )

      this.setState({ listingDrawerListings })
    } catch (e) {
      console.error(e)

      this.setState({ listingDrawerListings: [] })
    }
  }

  componentWillUnmount() {
    if (this.editor) {
      const iframe = this.editor.Canvas.getBody()

      iframe.removeEventListener('paste', this.iframePasteHandler)
      iframe.removeEventListener('click', this.iframeClickHandler)

      // Make the chance for others to cleanup the memory
      this.editor.trigger('editor:unload')
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

  setCanvasModeToStandardHTML5 = ({ el }) => {
    /**
     * The grapes canvas ignores the <!DOCTYPE html> tag when it loads a template.
     * This behaviour leads to render the code in HTML quirks mode which has different
     * output than the standard HTML5 mode.
     *
     * The Grapesjs maintainer suggested the following solution to resolve the issue:
     * https://github.com/artf/grapesjs/issues/3285#issuecomment-865389716
     */
    const doc = el.contentDocument

    doc.open()
    doc.write('<!DOCTYPE html>')
    doc.close()
  }

  loadTemplateOptions = async () => {
    if (!this.selectedTemplate) {
      this.selectedTemplateOptions = null

      return
    }

    this.selectedTemplateOptions = await getTemplateOptions(
      this.selectedTemplate
    )
  }

  get selectedTemplateFonts() {
    if (
      this.selectedTemplateOptions &&
      this.selectedTemplateOptions.textEditor &&
      this.selectedTemplateOptions.textEditor.extraFonts
    ) {
      return this.selectedTemplateOptions.textEditor.extraFonts
    }

    return []
  }

  get selectedTemplateColors() {
    if (
      this.selectedTemplateOptions &&
      this.selectedTemplateOptions.textEditor &&
      this.selectedTemplateOptions.textEditor.extraColors
    ) {
      return this.selectedTemplateOptions.textEditor.extraColors
    }

    return []
  }

  loadCKEditor = () => {
    return new Promise(resolve => {
      loadJS('/static/ckeditor/ckeditor.js', 'ckeditor', resolve)
    })
  }

  getTemplateMarkupFonts = () => {
    try {
      const document = this.editor.Canvas.getDocument()

      return [
        ...new Set(Array.from(document.fonts).map(({ family }) => family))
      ]
    } catch (e) {
      return []
    }
  }

  getCKEditorPluginsToRemove = () => {
    if (this.isMjmlTemplate) {
      return []
    }

    return ['quicktable', 'tableresize', 'tabletools', 'table', 'placeholder']
  }

  loadCKEditorRTE = async () => {
    const { activeBrand } = this.props
    const colors =
      this.selectedTemplateColors.length > 0
        ? this.selectedTemplateColors
        : getBrandColors(activeBrand)

    return attachCKEditor(this.editor, [], colors, undefined, () => {
      const templateFonts = this.selectedTemplateFonts

      const fonts =
        templateFonts.length > 0 ? templateFonts : this.getTemplateMarkupFonts()

      const pluginsToRemove = this.getCKEditorPluginsToRemove()

      return {
        font_names: fonts.join(';'),
        removePlugins: pluginsToRemove
      }
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
            dblclick: event => {
              const selectedElement = this.editor.getSelected()

              if (!selectedElement) {
                return
              }

              const currentSelectedDOMElement = selectedElement.getEl()

              // In order to make sure we're not changing another image element
              // when we have a selectable image element selected
              // and we're dbl clicking on an unselectable image
              if (currentSelectedDOMElement !== event.target) {
                return
              }

              this.setState({ isImageSelectDialogOpen: true })
            }
          }
        })
      })
    })
  }

  setupGrapesJs = async () => {
    registerCommands(this.editor)
    patchConditionalToolbarButtonsIssue(this.editor)
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
    this.singleClickTextEditing()
    this.loadTraitsOnSelect()
    this.setupRTEMerge()
    this.setupFixToolbarPosition()
    this.disableAssetManager()
    this.makeTemplateCentered()
    this.removeTextStylesOnPaste()
    this.deselectComponentsOnCanvasClick()
    this.disableDefaultDeviceManager()
    this.scrollSidebarToTopOnComponentSelect()

    if (this.isEmailTemplate && this.isMjmlTemplate) {
      await this.registerEmailBlocks()
    } else if (this.isWebsiteTemplate) {
      await this.registerWebsiteBlocks()
    }

    this.registerComponentExtensions()

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
        },
        shouldUseDefaultAgents:
          this.isEmailTemplateForCampaigns || this.isTemplateForOtherAgents,
        defaultAgents:
          this.props.templateData && this.props.templateData.user
            ? [
                {
                  agent: this.props.templateData.user,
                  contacts: []
                }
              ]
            : []
      },
      image: {
        onDrop: () => {
          this.setState({ isImageSelectDialogOpen: true })
        }
      },
      video: {
        onDrop: this.openSearchVideoDrawer
      },
      article: {
        onDrop: () => {
          this.setState({ isArticleDrawerOpen: true })
        }
      }
    }

    const activeTeamSettings = this.props.activeBrandSetting

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

    const { activeBrand, templateData } = this.props
    const renderData = getTemplateRenderData(activeBrand)

    removeUnusedBlocks(this.editor)

    const emailBlocksOptions = this.getBlocksOptions()

    const templateBlockOptions = await getTemplateBlockOptions(
      this.selectedTemplate,
      this.selectedTemplateOptions
    )

    this.blocks = registerEmailBlocks(
      this.editor,
      {
        ...templateData,
        ...renderData
      },
      templateBlockOptions,
      emailBlocksOptions
    )
  }

  async registerSocialBlocks() {
    const { activeBrand, templateData } = this.props
    const renderData = getTemplateRenderData(activeBrand)

    const templateBlockOptions = await getTemplateBlockOptions(
      this.selectedTemplate,
      this.selectedTemplateOptions
    )

    removeUnusedBlocks(this.editor)
    this.blocks = registerSocialBlocks(
      this.editor,
      {
        ...templateData,
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

    const { activeBrand, templateData } = this.props
    const renderData = getTemplateRenderData(activeBrand)

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
      onVideoDoubleClick: this.openSearchVideoDrawer,
      onEmptyVideoClick: this.openSearchVideoDrawer
    }

    const templateBlockOptions = await getTemplateBlockOptions(
      this.selectedTemplate,
      this.selectedTemplateOptions
    )

    this.blocks = registerWebsiteBlocks(
      this.editor,
      {
        ...templateData,
        ...renderData
      },
      templateBlockOptions,
      blocksOptions
    )
  }

  registerComponentExtensions() {
    // We should not re-register extensions if it's already done!
    if (this.componentExtensionsRegistered) {
      return
    }

    this.componentExtensionsRegistered = true

    if (this.isWebsiteTemplate) {
      return
    }

    if (this.isEmailTemplate && this.isMjmlTemplate) {
      addFallbackSrcToMjImage(this.editor)

      return
    }

    addFallbackSrcToImage(this.editor)
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

  openCarouselDrawer = model => {
    this.setState({ carouselToEdit: model })
  }

  openMapDrawer = model => {
    this.setState({ mapToEdit: model })
  }

  openSearchVideoDrawer = model => {
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

  mergeRTEToolbarWithActionsToolbar = () => {
    setTimeout(() => {
      const richTextToolbar = this.editor.RichTextEditor.getToolbarEl()

      if (!richTextToolbar) {
        return
      }

      if (getComputedStyle(richTextToolbar).display === 'none') {
        return
      }

      richTextToolbar.style.display = 'none'

      const toolbar = document.querySelector('.gjs-toolbar')

      if (toolbar) {
        toolbar.appendChild(richTextToolbar)
      }

      richTextToolbar.style.display = 'flex'

      setTimeout(this.resetToolbarPosition, 200)
    }, 100)
  }

  setupRTEMerge = () => {
    this.editor.on('rte:enable', () => {
      this.mergeRTEToolbarWithActionsToolbar()
    })

    this.editor.on('component:drag:end', this.resetToolbarPosition)
  }

  resetToolbarPosition = () => {
    const selected = this.editor.getSelected()

    if (!selected) {
      return
    }

    this.editor.selectRemove(selected)
    this.editor.select(selected)
  }

  setupFixToolbarPosition = () => {
    const iframe = this.editor.Canvas.getFrameEl()

    if (!iframe || !iframe.contentDocument) {
      return
    }

    let timeoutHandler

    iframe.contentDocument.addEventListener(
      'scroll',
      () => {
        if (timeoutHandler) {
          clearTimeout(timeoutHandler)
        }

        timeoutHandler = setTimeout(this.resetToolbarPosition, 100)
      },
      {
        passive: true
      }
    )
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

  deselectComponentsOnCanvasClick = () => {
    const iframeBody = this.editor.Canvas.getBody()

    iframeBody.addEventListener('click', this.iframeClickHandler)
  }

  iframePasteHandler = ev => {
    if (!ev.target.contentEditable) {
      return
    }

    const text = ev.clipboardData.getData('text/plain')

    ev.target.ownerDocument.execCommand('insertText', false, text)
    ev.preventDefault()
  }

  iframeClickHandler = ev => {
    const parentNode = ev.target.parentNode

    if (parentNode.id !== 'wrapper') {
      return
    }

    this.deselectAll()
    ev.stopPropagation()
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
    const activeBrand = this.props.activeBrand
    const renderData = getTemplateRenderData(activeBrand)

    return nunjucks.renderString(templateMarkup, {
      ...data,
      ...renderData,
      brand: activeBrand
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
    this.editor.trigger('editor:template:loaded') // Let others know the template is loaded
    this.lockIn()
    this.deselectAll()
    this.resize()

    if (this.isEmailTemplate && this.isMjmlTemplate) {
      this.registerEmailBlocks()
    } else if (this.isWebsiteTemplate) {
      this.registerWebsiteBlocks()
    }

    this.registerComponentExtensions()
  }

  deselectAll = () => {
    this.editor.selectRemove(this.editor.getSelectedAll())
  }

  resize = () => {
    const canvas = this.editor.Canvas.getBody()
    const viewport = document.querySelector('.gjs-cv-canvas')

    const { width: canvasWidth, height: canvasHeight } =
      canvas.getBoundingClientRect()

    const { width: viewportWidth, height: viewportHeight } =
      viewport.getBoundingClientRect()

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
      async () => {
        await this.loadTemplateOptions()

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

  get isEmailMedium() {
    if (this.selectedTemplate) {
      return this.selectedTemplate.medium === 'Email'
    }

    return false
  }

  get shouldShowEmailActions() {
    if (
      this.isBareMode ||
      this.shouldShowSaveAsTemplateButton ||
      this.shouldShowCreateSuperCampaignButton
    ) {
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
    if (
      this.isBareMode ||
      this.shouldShowSaveAsTemplateButton ||
      this.shouldShowCreateSuperCampaignButton
    ) {
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
    if (
      this.isBareMode ||
      this.shouldShowSaveAsTemplateButton ||
      this.shouldShowCreateSuperCampaignButton
    ) {
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
      }
    )
  }

  toggleTemplatesColumnVisibility = () => {
    this.setState(prevState => ({
      ...prevState,
      isTemplatesColumnHidden: !prevState.isTemplatesColumnHidden
    }))
  }

  get DealsDefaultList() {
    return getMlsDrawerInitialDeals(this.props.deals)
  }

  get isTemplateForOtherAgents() {
    return this.props.templatePurpose === 'ForOtherAgents'
  }

  get isEmailTemplateForCampaigns() {
    return this.isEmailMedium && this.props.templatePurpose === 'ForCampaigns'
  }

  get shouldShowSaveAsTemplateButton() {
    // We need this because we should respect the user answer on the purpose drawer
    if (!this.isTemplateForOtherAgents) {
      return false
    }

    return hasSaveAsTemplateButton(
      this.isBareMode,
      !!this.state.selectedTemplate,
      this.props.isAdminUser,
      this.isOpenHouseMedium
    )
  }

  get shouldShowCreateSuperCampaignButton() {
    // We need this because we should respect the user answer on the purpose drawer
    if (!this.isEmailTemplateForCampaigns) {
      return false
    }

    return hasCreateSuperCampaignButton(
      this.isBareMode,
      !!this.state.selectedTemplate,
      this.props.isAdminUser,
      this.isEmailMedium
    )
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
    const uploadedAsset = await uploadAsset(templateId, file)

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

  get templateInstanceData() {
    const listingsArray = this.props.templateData.listing
      ? [this.props.templateData.listing]
      : this.props.templateData.listings

    return {
      contacts: this.props.templateData.contacts?.map(contact => contact.id),
      listings: listingsArray
        ?.filter(listing => !listing.isMock) // Remove mock listings
        ?.map(listing => listing.id), // Collect all listing ids
      deals: this.props.templateData.deals?.map(deal => deal.id)
    }
  }

  render() {
    if (this.state.isLoading) {
      return null
    }

    return (
      <Portal root="marketing-center">
        <Container
          hideBlocks={!this.hasBlocks}
          className="template-builder mui-fixed"
          style={this.props.containerStyle}
        >
          {this.state.isListingDrawerOpen && (
            <SearchListingDrawer
              allowHipPocket
              onHipPocketImageUpload={
                this.selectedTemplate
                  ? getHipPocketTemplateImagesUploader(this.selectedTemplate.id)
                  : undefined
              }
              multipleSelection
              renderAction={props => (
                <Button
                  variant="contained"
                  color="secondary"
                  {...props.buttonProps}
                >
                  Next ({props.selectedItemsCount} Listings Selected)
                </Button>
              )}
              withMlsDisclaimer
              isOpen
              title="Select Listing"
              defaultLists={[
                {
                  title: 'Add from your MLS listings',
                  items: this.state.listingDrawerListings
                },
                {
                  title: 'Add from your deals',
                  items: this.DealsDefaultList
                }
              ]}
              onClose={() => {
                this.blocks.listing.selectHandler()
                this.setState({ isListingDrawerOpen: false })
              }}
              onSelectListingsCallback={listings => {
                listings.forEach(this.addListingAssets)

                const listingsWithFallbackImages = listings.map(listing => ({
                  ...listing,
                  gallery_image_urls: getArrayWithFallbackAccessor(
                    listing.gallery_image_urls,
                    PLACEHOLDER_IMAGE_URL
                  )
                }))

                this.blocks.listing.selectHandler(listingsWithFallbackImages)
                this.setState({ isListingDrawerOpen: false })
              }}
            />
          )}
          {this.state.isAgentDrawerOpen && (
            <TeamAgentsDrawer
              open
              multiSelection
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
                const uploadedAsset = await uploadAsset(templateId, file)

                this.editor.runCommand('set-image', {
                  value: uploadedAsset.file.url
                })
                this.setState({ imageToEdit: null })
              }}
            />
          )}
          {!!this.state.videoToEdit && (
            <SearchVideoDrawer
              model={this.state.videoToEdit}
              shouldSkipVideoGif={this.props.shouldSkipVideoGif}
              onClose={() => {
                this.blocks.video.selectHandler()
                this.setState({ videoToEdit: null })
              }}
              onSelect={video => {
                this.blocks.video.selectHandler(video)
                this.setState({ videoToEdit: null })
              }}
              uploadThumbnail={async file => {
                const templateId = this.selectedTemplate.id
                const uploadedAsset = await uploadAsset(templateId, file)

                return uploadedAsset.file.url
              }}
            />
          )}
          <SearchArticleDrawer
            isOpen={this.state.isArticleDrawerOpen}
            onClose={() => {
              this.blocks.article.selectHandler()
              this.setState({ isArticleDrawerOpen: false })
            }}
            onSelect={article => {
              this.blocks.article.selectHandler(article)
              this.setState({ isArticleDrawerOpen: false })
            }}
            multipleSelection
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
                  <IconButton
                    onClick={this.toggleTemplatesColumnVisibility}
                    data-tour-id="change-template"
                  >
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

            {this.editor && (this.isEmailTemplate || this.isWebsiteTemplate) && (
              <>
                <DeviceManager editor={this.editor} />
                <Divider orientation="vertical" />
              </>
            )}

            <Actions>
              {this.props.customActions}

              {this.shouldShowSaveAsTemplateButton && (
                <AddToMarketingCenterButton
                  medium={this.selectedTemplate.medium}
                  inputs={this.selectedTemplate.inputs}
                  originalTemplateId={this.selectedTemplate.id}
                  video={this.selectedTemplate.video}
                  mjml={this.selectedTemplate.mjml}
                  getTemplateMarkup={this.getTemplateMarkup.bind(this)}
                  disabled={this.props.actionButtonsDisabled}
                />
              )}

              {this.shouldShowCreateSuperCampaignButton && (
                <CreateSuperCampaignButton
                  disabled={this.props.actionButtonsDisabled}
                  template={this.selectedTemplate}
                  getTemplateMarkup={this.getTemplateMarkup.bind(this)}
                  templateInstanceData={this.templateInstanceData}
                />
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

              {(this.isOpenHouseMedium ||
                this.shouldShowEmailActions ||
                this.isBareMode) &&
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
              {this.isVideoTemplate &&
                this.editor &&
                this.editor.DomComponents.getWrapper().view && (
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
  onBuilderLoad: PropTypes.func,
  hideTemplatesColumn: PropTypes.bool,
  templateData: PropTypes.object,
  templateTypes: PropTypes.arrayOf(PropTypes.string),
  mediums: PropTypes.string,
  assets: PropTypes.arrayOf(PropTypes.object),
  defaultTemplate: PropTypes.object,
  containerStyle: PropTypes.object,
  isTemplatesColumnHiddenDefault: PropTypes.bool,
  bareMode: PropTypes.bool,
  saveButtonText: PropTypes.string,
  saveButtonStartIcon: PropTypes.node,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onSocialSharing: PropTypes.func,
  onPrintableSharing: PropTypes.func,
  actionButtonsDisabled: PropTypes.bool,
  customActions: PropTypes.node,
  saveButtonWrapper: PropTypes.func,
  templatePurpose: PropTypes.string,
  shouldSkipVideoGif: PropTypes.bool
}

Builder.defaultProps = {
  onBuilderLoad: () => null
}

function mapStateToProps({ user, deals, ...state }) {
  return {
    user,
    deals: deals.list,
    isAdminUser: isAdmin(selectActiveTeamUnsafe(state)),
    activeBrand: selectActiveBrand(state),
    activeBrandSetting: selectActiveBrandSettings(state, true)
  }
}

export default connect(mapStateToProps, { notify: addNotification })(Builder)
