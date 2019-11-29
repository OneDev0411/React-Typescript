import React, {
  ComponentType,
  createContext,
  createRef,
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
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import cn from 'classnames'
import { Box, makeStyles, Tooltip } from '@material-ui/core'
import { shallowEqual } from 'recompose'

import IconLink from 'components/SvgIcons/Link/IconLink'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { getShortcutTooltip } from 'utils/get-shortcut-tooltip'
import { useRerenderOnChange } from 'hooks/use-rerender-on-change'

import { LinkEditorPopover } from './components/LinkEditorPopover'

import { EditorContainer, EditorWrapper, Separator, Toolbar } from './styled'
import { FieldError } from '../final-form-fields/FieldError'
import { RichTextButtons } from './buttons/RichTextButtons'
import { shouldHidePlaceholder } from './utils/should-hide-placeholder'
import {
  DraftJsSelectionPopover,
  SelectionPopoverRenderProps
} from './components/DraftJsSelectionPopover'
import { LinkPreview } from './components/LinkPreview'
import { Checkbox } from '../Checkbox'
import {
  EditorContextApi,
  EditorToolbarContextApi,
  RichTextFeature,
  TextEditorProps
} from './types'
import { getHtmlConversionOptions } from './utils/get-html-conversion-options'
import { createEditorRef } from './create-editor-ref'
import { createPlugins } from './create-plugins'
import { ToolbarIconButton } from './buttons/ToolbarIconButton'
import { getSelectedAtomicBlock } from './utils/get-selected-atomic-block'
import { styles } from './styles'
import { useEmojiStyles } from './hooks/use-emoji-styles'
import { useCreateToolbarContext } from './hooks/use-create-toolbar-context'
import { ToolbarFragments } from './components/ToolbarFragments'
import { useCreateEditorContext } from './hooks/use-create-editor-context'

const useStyles = makeStyles(styles, { name: 'TextEditor' })

const editorContextMethodStub = () => {
  throw new Error(
    'Editor context is meant to be used within the editor. You are probably using a Feature Component outside the editor'
  )
}
const editorToolbarContextMethodStub = () => {
  throw new Error(
    'Editor Toolbar context is meant to be used within the editor. You are probably using ToolbarFragment outside the editor'
  )
}
export const EditorContext = createContext<EditorContextApi>({
  addPlugins: editorContextMethodStub,
  editorRef: createRef(),
  editorState: (null as unknown) as EditorState,
  addDropzonePropsInterceptor: editorContextMethodStub,
  setEditorState: editorContextMethodStub
})
export const EditorToolbarContext = createContext<EditorToolbarContextApi>({
  createToolbarSegment: editorToolbarContextMethodStub
})

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
      children,
      className = '',
      defaultValue = '',
      disabled = false,
      autofocus = false,
      minHeight = true,
      input = null,
      onChange = () => {},
      placeholder = 'Type something…',
      plugins = [],
      DraftEditorProps = {},
      signature,
      hasSignatureByDefault = false,
      onEditSignature = () => {},
      richText = true,
      enableEmoji = true,
      enableSignature = false,
      onAttachmentDropped,
      textAlignment,
      appendix = null,
      toolbarRef,
      style,
      ...props
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

    const richTextFeatures: RichTextFeature[] =
      richText === true ? Object.values(RichTextFeature) : richText || []

    const classes = useStyles(props)

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

    const emojiTheme = useEmojiStyles()
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
      linkPlugins,
      signaturePlugin,
      richButtonsPlugin,
      emojiPlugin,
      EmojiSelect,
      EmojiSuggestions,
      ...otherPlugins
    } = useMemo(
      () =>
        createPlugins(
          setLinkEditorOpen,
          () => signatureRef.current || '',
          stateFromHtmlOptions,
          emojiTheme
        ),
      [emojiTheme, stateFromHtmlOptions]
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

    useImperativeHandle(
      ref,
      createEditorRef({
        editorElementRef,
        editorRef,
        handleChange,
        stateToHtmlOptions,
        stateFromHtmlOptions
      }),
      [stateToHtmlOptions]
    )

    const showNoSignatureModal = () => {
      confirmation!.setConfirmationModal({
        message:
          'You don’t have an email signature yet. Would you like to create one?',
        confirmLabel: 'Set signature',
        onConfirm: onEditSignature
      })
    }

    const {
      editorContext,
      plugins: contextPlugins,
      getDropzoneProps
    } = useCreateEditorContext({
      editorState,
      onChange: handleChange,
      editorRef
    })

    const { toolbarContext, toolbarSegments } = useCreateToolbarContext()

    const defaultPlugins = [
      ...Object.values(contextPlugins),
      ...Object.values(otherPlugins),
      ...(richText ? [richButtonsPlugin] : []),
      ...(richTextFeatures.includes(RichTextFeature.LINK) ? linkPlugins : []),
      ...(enableEmoji ? [emojiPlugin] : []),
      ...(enableSignature ? [signaturePlugin] : [])
    ]

    const allPlugins = [...defaultPlugins, ...plugins]

    const rerenderEditor = useRerenderOnChange(allPlugins, shallowEqual)

    const dropzoneProps: Partial<
      ComponentType<typeof Dropzone>
    > = getDropzoneProps({
      disabled: !onAttachmentDropped,
      fileAccept: onAttachmentDropped ? '*/*' : undefined,
      onDrop: (files: File[]) => {
        if (files && files[0] && onAttachmentDropped) {
          onAttachmentDropped(files)
        }
      }
    })

    const handlerWrapperClick = e => {
      // It's important to check if it's the wrapper which is clicked
      // and don't call focus when an inner element is clicked, as it
      // leads to very buggy behavior. For example if atomic block is focused
      // and something (like resizing image with resize dropdown) causes
      // this code to run the editor's focus, it goes to a buggy state
      // in which nothing will unselect the atomic block. The only way
      // to escape this buggy condition in this case is to blur and
      // focus again the editor
      if (e.target === editorElementRef.current) {
        editorRef.current && editorRef.current.focus()
      }
    }

    return (
      <EditorContainer
        className={cn(className, classes.root)}
        style={style}
        minHeight={minHeight}
      >
        <EditorWrapper
          ref={editorElementRef}
          className={cn(
            {
              'hide-placeholder': shouldHidePlaceholder(editorState)
            },
            classes.content
          )}
          onClick={handlerWrapperClick}
          data-test="text-editor-wrapper"
        >
          {/* I wish we had upgraded Dropzone to use the hook version :( */}
          <Dropzone
            {...dropzoneProps}
            className={classes.dropzone}
            activeClassName={classes.dropzoneActive}
            rejectClassName={classes.dropzoneReject}
            disableClick
          >
            {rerenderEditor && (
              <PluginsEditor
                spellCheck
                readOnly={disabled}
                editorState={editorState}
                onChange={handleChange}
                plugins={allPlugins}
                placeholder={placeholder}
                textAlignment={textAlignment}
                ref={editorRef}
                {...DraftEditorProps}
              />
            )}
            <EditorContext.Provider value={editorContext}>
              <EditorToolbarContext.Provider value={toolbarContext}>
                {children}
              </EditorToolbarContext.Provider>
            </EditorContext.Provider>
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
                {({ entity, close, block }: SelectionPopoverRenderProps) => (
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
            {emojiPlugin && <EmojiSuggestions />}
            {appendix}
          </Dropzone>
        </EditorWrapper>
        <Toolbar ref={toolbarRef} className={classes.toolbar}>
          <ToolbarFragments segments={toolbarSegments} />
          <RichTextButtons
            features={richTextFeatures}
            richButtonsPlugin={richButtonsPlugin}
          />
          {richTextFeatures.includes(RichTextFeature.LINK) && (
            <>
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

          {enableEmoji && (
            <>
              <Tooltip title="Emoji (:)">
                <span>
                  <EmojiSelect />
                </span>
              </Tooltip>
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
        {input && <FieldError name={input.name} />}
      </EditorContainer>
    )
  }
)

const isBlockLinked = (block: ContentBlock) => !!block.getData().get('href')
