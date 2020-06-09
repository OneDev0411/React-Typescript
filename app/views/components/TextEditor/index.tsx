import React, {
  ComponentType,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react'
import Dropzone from 'react-dropzone'
import { EditorState } from 'draft-js'
import PluginsEditor from 'draft-js-plugins-editor'
import cn from 'classnames'
import { makeStyles } from '@material-ui/core'
import { shallowEqual } from 'recompose'

import { useRerenderOnChange } from 'hooks/use-rerender-on-change'

import { EditorContainer, EditorWrapper, Toolbar } from './styled'
// import { FieldError } from '../final-form-fields/FieldError'
import { shouldHidePlaceholder } from './utils/should-hide-placeholder'
import { TextEditorProps } from './types'
import { createEditorRef } from './create-editor-ref'
import { createPlugins } from './create-plugins'
import { styles } from './styles'
import { useCreateToolbarContext } from './hooks/use-create-toolbar-context'
import { ToolbarFragments } from './components/ToolbarFragments'
import { useCreateEditorContext } from './hooks/use-create-editor-context'
import { DEFAULT_EDITOR_FEATURES } from './default-editor-features'
import { EditorContext, EditorToolbarContext } from './editor-context'
import { moveSelectionToStart } from './modifiers/move-selection-to-start'

const useStyles = makeStyles(styles, { name: 'TextEditor' })

/**
 * Html wysiwyg editor.
 *
 * NOTE: this is an uncontrolled (stateful) component, and `onChange`
 * prop is only for being notified of changes. However it's possible
 * to reset html content imperatively via ref.
 *
 */
export const TextEditor = forwardRef(
  (
    {
      children = DEFAULT_EDITOR_FEATURES,
      className = '',
      defaultValue = '',
      disabled = false,
      autofocus = false,
      minHeight = true,
      onChange = (state: EditorState) => undefined,
      placeholder = 'Type something…',
      plugins = [],
      DraftEditorProps = {},
      onAttachmentDropped,
      textAlignment,
      appendix = null,
      toolbarRef,
      style,
      editorState,
      ...props
    }: TextEditorProps,
    ref
  ) => {
    const editorElementRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<PluginsEditor>(null)

    const classes = useStyles(props)

    /**
     * NOTE 1: We don't use top level plugin definition to prevent bugs when
     * more than one instance of Editor is rendered simultaneously
     * (which is used in contacts profile page right now).
     * See this for more info:
     * https://github.com/draft-js-plugins/draft-js-plugins/blob/master/FAQ.md#can-i-use-the-same-plugin-for-multiple-plugin-editors
     */
    const { ...otherPlugins } = useMemo(() => createPlugins(), [])

    const handleChange = (newState: EditorState) => {
      if (!newState) {
        return false
      }

      onChange(newState)
    }

    useImperativeHandle(
      ref,
      createEditorRef({
        editorElementRef
      })
    )

    const {
      editorContext,
      plugins: contextPlugins,
      getDropzoneProps
    } = useCreateEditorContext({
      editorState,
      onChange: handleChange,
      editorRef
    })

    const { toolbarContext, toolbarFragments } = useCreateToolbarContext()

    const defaultPlugins = [
      ...Object.values(contextPlugins),
      ...Object.values(otherPlugins)
    ]

    const allPlugins = [...defaultPlugins, ...plugins]

    const rerenderEditor = useRerenderOnChange(allPlugins, shallowEqual)

    const firstRenderFlagRef = useRef(true)

    useEffect(() => {
      if (firstRenderFlagRef.current && editorRef.current && rerenderEditor) {
        // draft-js-plugins-editor uses UNSAFE_componentWillMount to create
        // the editor state with proper decorator. If we don't delay running
        // this, it causes decorator to not being set correctly which has
        // serious consequences. e.g. links don't render properly.
        setTimeout(() => {
          const pluginsEditor = editorRef.current

          firstRenderFlagRef.current = false

          if (pluginsEditor) {
            onChange(moveSelectionToStart(pluginsEditor.getEditorState()))

            if (autofocus) {
              pluginsEditor.editor && pluginsEditor.focus()
            }
          }
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rerenderEditor])

    useEffect(() => {}, [])

    const dropzoneProps: Partial<ComponentType<
      typeof Dropzone
    >> = getDropzoneProps({
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
          <ToolbarFragments segments={toolbarFragments} />
        </Toolbar>
      </EditorContainer>
    )
  }
)

// {input && <FieldError name={input.name} />}
