import React, {
  ComponentType,
  createContext,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import Dropzone from 'react-dropzone'
import { EditorState } from 'draft-js'
import PluginsEditor from 'draft-js-plugins-editor'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import cn from 'classnames'
import { makeStyles } from '@material-ui/core'
import { shallowEqual } from 'recompose'

import { useRerenderOnChange } from 'hooks/use-rerender-on-change'

import { EditorContainer, EditorWrapper, Toolbar } from './styled'
import { FieldError } from '../final-form-fields/FieldError'
import { shouldHidePlaceholder } from './utils/should-hide-placeholder'
import {
  EditorContextApi,
  EditorToolbarContextApi,
  TextEditorProps
} from './types'
import { getHtmlConversionOptions } from './utils/get-html-conversion-options'
import { createEditorRef } from './create-editor-ref'
import { createPlugins } from './create-plugins'
import { styles } from './styles'
import { useCreateToolbarContext } from './hooks/use-create-toolbar-context'
import { ToolbarFragments } from './components/ToolbarFragments'
import { useCreateEditorContext } from './hooks/use-create-editor-context'
import { RichTextFeature } from './features/RichText'
import { EmojiFeature } from './features/Emoji'

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
  editorState: null as any,
  stateFromHtmlOptions: null as any,
  addDropzonePropsInterceptor: editorContextMethodStub,
  setEditorState: editorContextMethodStub
})
export const EditorToolbarContext = createContext<EditorToolbarContextApi>({
  createToolbarSegment: editorToolbarContextMethodStub
})

const DEFAULT_FEATURES = (
  <>
    <RichTextFeature />
    <EmojiFeature />
  </>
)
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
      children = DEFAULT_FEATURES,
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
      onAttachmentDropped,
      textAlignment,
      appendix = null,
      toolbarRef,
      style,
      ...props
    }: TextEditorProps,
    ref
  ) => {
    const editorElementRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<PluginsEditor>(null)
    const editorStateRef = useRef<EditorState | null>(null)

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
    const { ...otherPlugins } = useMemo(() => createPlugins(), [])

    const getInitialState = () => {
      const initialValue = (input && input.value) || defaultValue

      return EditorState.createWithContent(
        stateFromHTML(initialValue, stateFromHtmlOptions)
      )
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

    const {
      editorContext,
      plugins: contextPlugins,
      getDropzoneProps
    } = useCreateEditorContext({
      editorState,
      stateFromHtmlOptions,
      onChange: handleChange,
      editorRef
    })

    const { toolbarContext, toolbarSegments } = useCreateToolbarContext()

    const defaultPlugins = [
      ...Object.values(contextPlugins),
      ...Object.values(otherPlugins)
    ]

    const allPlugins = [...defaultPlugins, ...plugins]

    const rerenderEditor = useRerenderOnChange(allPlugins, shallowEqual)

    const dropzoneProps: Partial<
      ComponentType<typeof Dropzone>
    > = getDropzoneProps({
      disabled: !onAttachmentDropped,
      accept: onAttachmentDropped ? '*/*' : undefined,
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
            {appendix}
          </Dropzone>
        </EditorWrapper>
        <Toolbar ref={toolbarRef} className={classes.toolbar}>
          <ToolbarFragments segments={toolbarSegments} />
        </Toolbar>
        {input && <FieldError name={input.name} />}
      </EditorContainer>
    )
  }
)
