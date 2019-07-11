import React, {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'
import cn from 'classnames'

import { FieldProps } from 'react-final-form'

import IconBold from '../SvgIcons/Bold/IconBold'
import IconUnderline from '../SvgIcons/Underline/IconUnderline'
import IconItalic from '../SvgIcons/Italic/IconItalic'
import IconList from '../SvgIcons/List/ListIcon'
import IconNumberedList from '../SvgIcons/NumberedList/IconNumberedList'

import { EditorWrapper, Separator, Toolbar } from './styled'

import IconButton from './buttons/IconButton'
import HeadingButtons from './buttons/HeadingButtons'
import { FieldError } from '../final-form-fields/FieldError'

const richButtonsPlugin = createRichButtonsPlugin()

const {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  OLButton,
  ULButton,
  H1Button,
  H3Button,
  H4Button,
  H6Button
} = richButtonsPlugin

interface Props {
  defaultValue?: string
  input?: FieldProps<any>['input']
  onChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
  plugins?: any[]
  settings?: any
}

/**
 * Html wysiwyg editor.
 *
 * NOTE: this is an uncontrolled (stateful) component, and `onChange`
 * prop is only for being notified of changes. However it's possible
 * to reset html content imperatively via ref.
 */
export const TextEditor = forwardRef(
  (
    {
      defaultValue = '',
      disabled = false,
      input = null,
      onChange = () => {},
      placeholder = 'Type something…',
      plugins = [],
      settings = {}
    }: Props,
    ref
  ) => {
    const editorRef = useRef<any>(null)
    const [editorState, setEditorState] = useState(
      EditorState.createWithContent(stateFromHTML(defaultValue))
    )

    useImperativeHandle(
      ref,
      () => ({
        // convenient method for resetting editor html content
        reset: (html = '') => {
          setEditorState(EditorState.createWithContent(stateFromHTML(html)))
        },
        // convenient method for getting plain text of the editor content
        getPlainText: () => {
          if (editorRef.current) {
            return editorRef.current
              .getEditorState()
              .getCurrentContent()
              .getPlainText()
          }

          return ''
        },
        // convenient method for getting html content of the editor
        getHtml: () => {
          if (editorRef.current) {
            return stateToHTML(
              editorRef.current.getEditorState().getCurrentContent()
            )
          }
        },
        editorRef
      }),
      []
    )

    const handleTextChange = newState => {
      if (!newState) {
        return false
      }

      setEditorState(newState)

      const html = stateToHTML(newState.getCurrentContent())

      setTimeout(() => (input ? input.onChange(html) : onChange(html)))
    }

    const allPlugins = [
      richButtonsPlugin,
      ...plugins
    ]

    return (
      <Fragment>
        <Toolbar>
          <BoldButton>
            <IconButton>
              <IconBold />
            </IconButton>
          </BoldButton>

          <ItalicButton>
            <IconButton>
              <IconItalic />
            </IconButton>
          </ItalicButton>

          <UnderlineButton>
            <IconButton>
              <IconUnderline />
            </IconButton>
          </UnderlineButton>

          <Separator />

          <ULButton>
            <IconButton isBlockButton>
              <IconList />
            </IconButton>
          </ULButton>

          <OLButton>
            <IconButton isBlockButton>
              <IconNumberedList />
            </IconButton>
          </OLButton>

          <Separator />

          <HeadingButtons
            options={[
              {
                title: 'Small',
                component: H6Button
              },
              {
                title: 'Medium',
                component: H4Button
              },
              {
                title: 'Large',
                component: H3Button
              },
              {
                title: 'Huge',
                component: H1Button
              }
            ]}
          />

          <Separator />

          {/* <BlockquoteButton>
          <IconButton isBlockButton>
            <IconQuote />
          </IconButton>
        </BlockquoteButton> */}
        </Toolbar>

        <EditorWrapper
          className={cn({
            'hide-placeholder': shouldHidePlaceholder(editorState)
          })}
          onClick={() => editorRef.current.focus()}
          style={{
            minHeight: '10rem'
          }}
        >
          <Editor
            spellCheck
            readOnly={disabled}
            editorState={editorState}
            onChange={handleTextChange}
            plugins={allPlugins}
            placeholder={placeholder}
            ref={editorRef}
            {...settings}
          />
        </EditorWrapper>

        {input && <FieldError name={input.name} />}
      </Fragment>
    )
  }
)

function shouldHidePlaceholder(editorState) {
  const contentState = editorState.getCurrentContent()

  if (!contentState.hasText()) {
    if (
      contentState
        .getBlockMap()
        .first()
        .getType() !== 'unstyled'
    ) {
      return true
    }
  }

  return false
}
