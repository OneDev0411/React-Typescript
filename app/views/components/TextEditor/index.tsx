import React, {
  ComponentProps,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import Dropzone from 'react-dropzone'
import { ContentBlock, Editor as DraftEditor, EditorState } from 'draft-js'
import PluginsEditor from 'draft-js-plugins-editor'
import 'draft-js-image-plugin/lib/plugin.css'
import 'draft-js-alignment-plugin/lib/plugin.css'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import cn from 'classnames'
import { Box, makeStyles, Tooltip } from '@material-ui/core'

import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'
import { isImageFile } from 'utils/file-utils/is-image-file'
import IconLink from 'components/SvgIcons/Link/IconLink'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { getShortcutTooltip } from 'utils/get-shortcut-tooltip'

import { LinkEditorPopover } from './components/LinkEditorPopover'

import { EditorContainer, EditorWrapper, Separator, Toolbar } from './styled'
import { FieldError } from '../final-form-fields/FieldError'
import { AddImageButton } from './buttons/AddImageButton'
import { RichTextButtons } from './buttons/RichTextButtons'
import { shouldHidePlaceholder } from './utils/should-hide-placeholder'
import { updateEntityData } from './modifiers/update-entity-data'
import { DraftJsSelectionPopover } from './components/DraftJsSelectionPopover'
import { LinkPreview } from './components/LinkPreview/LinkPreview'
import { Checkbox } from '../Checkbox'
import { TextEditorProps } from './types'
import { getHtmlConversionOptions } from './utils/get-html-conversion-options'
import { createEditorRef } from './create-editor-ref'
import { createPlugins } from './create-plugins'
import { TemplateVariablesButton } from '../TemplateVariablesButton'
import { ITemplateVariableSuggestion } from '../TemplateVariablesButton/types'
import { insertTemplateVariable } from './modifiers/insert-template-expression'
import { removeUnwantedEmptyLineBeforeAtomic } from './modifiers/remove-unwanted-empty-block-before-atomic'
import { ToolbarIconButton } from './buttons/ToolbarIconButton'
import { getSelectedAtomicBlock } from './utils/get-selected-atomic-block'
import { styles } from './styles'
import { getImageDimensions } from './utils/get-image-dimensions'
import { getImageSizeOptions } from './utils/get-image-size-options'

const useStyles = makeStyles(styles, { name: 'TextEditor' })

/**
 * Html wysiwyg editor.
 *
 * NOTE: this is an uncontrolled (stateful) component, and `onChange`
 * prop is only for being notified of changes. However it's possible
 * to reset html content imperatively via ref.
 *
 * NOTE: this component is growing and needs some structural refactorings
 * for better encapsulation of different features like image, link,
 * signature, etc.
 *
 * This refactoring is intentionally delayed to get more insight about
 * how it should be done, as these features are added.
 * So please don't panic if you see this large component!
 */
export const TextEditor = forwardRef(
  (
    {
      className = '',
      defaultValue = '',
      disabled = false,
      autofocus = false,
      input = null,
      onChange = () => {},
      placeholder = 'Type something…',
      plugins = [],
      DraftEditorProps = {},
      uploadImage,
      signature,
      hasSignatureByDefault = false,
      onEditSignature = () => {},
      enableImage = false,
      enableRichText = true,
      enableSignature = false,
      enableTemplateVariables = false,
      templateVariableSuggestionGroups,
      onAttachmentDropped,
      appendix = null
    }: TextEditorProps,
    ref
  ) => {
    const signatureRef = useRef<TextEditorProps['signature']>(undefined)
    const editorElementRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<PluginsEditor>(null)
    const editorStateRef = useRef<EditorState | null>(null)
    const originalEditorRef = useRef<DraftEditor | null>(null)
    const [linkEditorOpen, setLinkEditorOpen] = useState(false)
    const confirmation = useContext(ConfirmationModalContext)

    const classes = useStyles()

    /**
     * Images are not rendered appropriately without this option.
     */
    const { stateToHtmlOptions, stateFromHtmlOptions } = useMemo(
      () =>
        getHtmlConversionOptions(() =>
          editorRef.current // editorRef is null in first render
            ? editorRef.current.getEditorState()
            : editorStateRef.current
        ),
      []
    )

    signatureRef.current = signature

    /**
     * NOTE 1: We don't use top level plugin definition to prevent bugs when
     * more than one instance of Editor is rendered simultaneously
     * (which is used in contacts profile page right now).
     * See this for more info:
     * https://github.com/draft-js-plugins/draft-js-plugins/blob/master/FAQ.md#can-i-use-the-same-plugin-for-multiple-plugin-editors
     *
     * NOTE 2: We always create all plugins because hooks can't be called
     * conditionally. We could have conditionally create real plugins or
     * undefined, based on enableXXX props but it adds lots of undefined checks
     * later in code which is not worth it.
     */
    const {
      imagePlugin,
      focusPlugin,
      alignmentPlugin,
      blockDndPlugin,
      resizeablePlugin,
      linkPlugins,
      signaturePlugin,
      richButtonsPlugin,
      ...otherPlugins
    } = useMemo(
      () =>
        createPlugins(
          setLinkEditorOpen,
          () => signatureRef.current || '',
          stateFromHtmlOptions
        ),
      [stateFromHtmlOptions]
    )

    if (editorRef.current) {
      originalEditorRef.current = editorRef.current.editor
    }

    const getInitialState = () => {
      const initialValue = (input && input.value) || defaultValue
      const initialState = EditorState.createWithContent(
        stateFromHTML(initialValue, stateFromHtmlOptions)
      )

      return hasSignatureByDefault &&
      !initialValue /* If there is some initial value, we don't want to mess with it */ &&
        signature
        ? signaturePlugin.modifiers.appendSignature(initialState)
        : initialState
    }
    const [editorState, setEditorState] = useState(getInitialState)

    editorStateRef.current = editorState

    useImperativeHandle(
      ref,
      createEditorRef({
        editorElementRef,
        editorRef,
        setEditorState,
        stateToHtmlOptions
      }),
      [stateToHtmlOptions]
    )

    useEffect(() => {
      const pluginsEditor = editorRef.current

      if (autofocus && pluginsEditor) {
        // draft-js-plugins-editor uses UNSAFE_componentWillMount to create
        // the editor state with proper decorator. If we don't delay running
        // this, it causes decorator to not being set correctly which has
        // serious consequences. e.g. links don't render properly.
        setImmediate(() => pluginsEditor.editor && pluginsEditor.focus())
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleChange = (newState: EditorState) => {
      if (!newState) {
        return false
      }

      setEditorState(newState)

      const newContent = newState.getCurrentContent()
      /**
       * We could have call onChange only of content state is changed to prevent
       * unnecessary calls when only selection is changed. But it causes
       * problems because {@link ContentState#mergeEntityData} (which is used
       * in alignment plugin and other places) mutates contentState in place
       * see this: https://github.com/facebook/draft-js/issues/940
       * Note that this issue is closed at the time of writing this comment
       * but it's without being fixed. At least in v0.10
       */

      const html =
        newContent.getPlainText() === '' // isEmpty returns false if there is an empty paragraph
          ? ''
          : stateToHTML(newContent, stateToHtmlOptions)

      setTimeout(() => (input ? input.onChange(html) : onChange(html)))
    }

    /**
     * Adds an image to the editor from a URL or dataURL. if it's a dataUrl
     * and `uploadImage` prop is provided, it will be called with a Blob
     * object to upload the image. `uploadImage` should return a promise
     * which is resolved to the url of the uploaded image. when it's resolved
     * the url of the image will be replaced with that.
     *
     * Note that it's not necessarily required to pass `uploadImage`, if
     * data urls in the output are accepted. It's not the case for emails
     * for example as data urls are not well supported in emails.
     *
     * This function can be called either when an image is dropped into the
     * editor or it's selected via an image picker UI (created by
     * AddImageButton)
     * @param file
     */
    const addImage = async (file: File) => {
      if (!isImageFile(file)) {
        return
      }

      // We first convert image to data url and show it.
      const dataUrl = await readFileAsDataUrl(file)

      const { bestFit } = getImageSizeOptions(await getImageDimensions(dataUrl))

      handleChange(
        removeUnwantedEmptyLineBeforeAtomic(
          imagePlugin.addImage(
            editorState,
            dataUrl,
            uploadImage ? { uploading: true, ...bestFit } : bestFit
          )
        )
      )

      // Then we try to upload it if the uploadImage function is provided.
      // When the upload is finished, we replace the image src with the uploaded
      // file's url.
      if (uploadImage) {
        // TODO: handle errors and remove the image in this case.
        const uploadedImageUrl = await uploadImage(file)

        if (editorRef.current) {
          const latestState = editorRef.current.getEditorState()

          handleChange(
            updateEntityData(
              imagePlugin,
              latestState,
              data => data.src === dataUrl,
              { src: uploadedImageUrl, uploading: false }
            )
          )
        }
      } else {
        console.warn(
          '[Editor]: dataURL image is inserted by no uploadImage passed. data urls will be preserved in the output'
        )
      }
    }

    const showNoSignatureModal = () => {
      confirmation!.setConfirmationModal({
        message:
          'You don’t have an email signature yet. Would you like to create one?',
        confirmLabel: 'Set signature',
        onConfirm: onEditSignature
      })
    }

    const defaultPlugins = [
      ...Object.values(otherPlugins),
      ...(enableRichText ? [richButtonsPlugin, ...linkPlugins] : []),
      ...(enableImage
        ? [
            blockDndPlugin,
            focusPlugin,
            alignmentPlugin,
            resizeablePlugin,
            imagePlugin
          ]
        : []),
      ...(enableSignature ? [signaturePlugin] : [])
    ]

    const allPlugins = [...defaultPlugins, ...plugins]

    const insertVariable = (suggestion: ITemplateVariableSuggestion) => {
      setEditorState(
        insertTemplateVariable(
          editorState,
          suggestion.expression,
          suggestion.defaultFallback
        )
      )
    }

    const isFileDropEnabled = enableImage || onAttachmentDropped
    const fileAccept =
      !onAttachmentDropped && enableImage ? 'image/*' : undefined

    const onDrop = (files: File[]) => {
      if (!files || !files[0]) {
        return
      }

      if (isImageFile(files[0])) {
        addImage(files[0])
      } else if (onAttachmentDropped) {
        onAttachmentDropped(files)
      }
    }

    return (
      <EditorContainer className={className}>
        <EditorWrapper
          ref={editorElementRef}
          className={cn({
            'hide-placeholder': shouldHidePlaceholder(editorState)
          })}
          onClick={() => editorRef.current && editorRef.current.focus()}
          data-test="text-editor-wrapper"
        >
          {/* I wish we had upgraded Dropzone to use the hook version :( */}
          <Dropzone
            disabled={!isFileDropEnabled}
            className={classes.dropzone}
            activeClassName={classes.dropzoneActive}
            rejectClassName={classes.dropzoneReject}
            onDrop={onDrop}
            accept={fileAccept}
            disableClick
          >
            <PluginsEditor
              spellCheck
              readOnly={disabled}
              editorState={editorState}
              onChange={handleChange}
              plugins={allPlugins}
              placeholder={placeholder}
              ref={editorRef}
              {...DraftEditorProps}
            />
            <LinkEditorPopover
              editorRef={originalEditorRef}
              editorState={editorState}
              setEditorState={handleChange}
              open={linkEditorOpen}
              onClose={() => {
                setLinkEditorOpen(false)

                const selectedBlock = getSelectedAtomicBlock(editorState)

                if (!selectedBlock || selectedBlock.getType() !== 'atomic') {
                  // atomic block selection is not preserved after focus
                  // so we don't focus if an atomic block is selected
                  setTimeout(() => {
                    editorRef.current!.focus()
                  })
                }
              }}
            />
            {!linkEditorOpen && (
              <DraftJsSelectionPopover
                editorState={editorState}
                inlineEntityFilter="LINK"
                blockFilter={isBlockLinked}
              >
                {({
                  entity,
                  close,
                  block
                }: Parameters<
                  ComponentProps<typeof DraftJsSelectionPopover>['children']
                >[0]) => (
                  <LinkPreview
                    editorState={editorState}
                    setEditorState={handleChange}
                    onClose={close}
                    url={
                      (entity && entity.getData().url) ||
                      (block && block.getData().get('href')) ||
                      ''
                    }
                    onEdit={() => setLinkEditorOpen(true)}
                  />
                )}
              </DraftJsSelectionPopover>
            )}
            {appendix}
          </Dropzone>
        </EditorWrapper>
        <Toolbar>
          {enableRichText && (
            <>
              <RichTextButtons richButtonsPlugin={richButtonsPlugin} />
              <Tooltip title={getShortcutTooltip('Insert Link', 'K')}>
                <ToolbarIconButton
                  onClick={event => {
                    setLinkEditorOpen(true)
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                >
                  <IconLink />
                </ToolbarIconButton>
              </Tooltip>
              <Separator />
            </>
          )}

          {enableImage && (
            <>
              <AddImageButton onImageSelected={addImage} />
              <Separator />
            </>
          )}

          {enableTemplateVariables && (
            <>
              <TemplateVariablesButton
                suggestions={templateVariableSuggestionGroups || []}
                onSuggestionSelected={suggestion => insertVariable(suggestion)}
              />
              <Separator />
            </>
          )}

          {enableSignature && (
            <Box pl={0.5}>
              <Checkbox
                inputProps={{ tabIndex: 1 }}
                checked={signaturePlugin.hasSignature()}
                onChange={() =>
                  signature
                    ? signaturePlugin.toggleSignature()
                    : showNoSignatureModal()
                }
              >
                Signature
              </Checkbox>
            </Box>
          )}
        </Toolbar>
        <alignmentPlugin.AlignmentTool />
        {input && <FieldError name={input.name} />}
      </EditorContainer>
    )
  }
)

const isBlockLinked = (block: ContentBlock) => !!block.getData().get('href')
