import React, {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'

import { InputError } from 'components/Forms/styled'

import IconBold from '../SvgIcons/Bold/IconBold'
import IconUnderline from '../SvgIcons/Underline/IconUnderline'
import IconItalic from '../SvgIcons/Italic/IconItalic'
import IconList from '../SvgIcons/List/ListIcon'
import IconNumberedList from '../SvgIcons/NumberedList/IconNumberedList'

import { Separator, Toolbar } from './styled'

import IconButton from './buttons/IconButton'
import HeadingButtons from './buttons/HeadingButtons'

const richButtonsPlugin = createRichButtonsPlugin()

const {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  BlockquoteButton,
  OLButton,
  ULButton,
  H1Button,
  H3Button,
  H4Button,
  H6Button
} = richButtonsPlugin

/**
 * Html wysiwyg editor.
 *
 * NOTE: this is an uncontrolled (stateful) component, and `onChange`
 * prop is only for being notified of changes. However it's possible
 * to reset html content imperatively via ref.
 */
export const TextEditor = forwardRef((props, ref) => {
  const editorRef = useRef()
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(stateFromHTML(props.defaultValue))
  )

  useImperativeHandle(
    ref,
    () => ({
      // convenient method for resetting editor html content
      reset: (html = '') => {
        setEditorState(EditorState.createWithContent(stateFromHTML(html)))
      },
      // convenient method for getting plain text of the editor content
      getPlainText: () =>
        editorRef.current
          .getEditorState()
          .getCurrentContent()
          .getPlainText(),
      // convenient method for getting html content of the editor
      getHtml: () =>
        stateToHTML(editorRef.current.getEditorState().getCurrentContent()),
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

    setTimeout(() =>
      props.input ? props.input.onChange(html) : props.onChange(html)
    )
  }

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

      <div
        onClick={() => editorRef.current.focus()}
        style={{
          minHeight: '10rem'
        }}
      >
        <Editor
          spellCheck
          readOnly={props.disabled}
          editorState={editorState}
          onChange={handleTextChange}
          plugins={[richButtonsPlugin, ...props.plugins]}
          placeholder={props.placeholder}
          ref={editorRef}
          {...props.settings}
        />
      </div>

      {props.meta && props.meta.error && props.meta.touched && (
        <InputError style={{ marginTop: '0.5rem' }}>
          {props.meta.error}
        </InputError>
      )}
    </Fragment>
  )
})

TextEditor.propTypes = {
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  input: PropTypes.object,
  disabled: PropTypes.bool,
  meta: PropTypes.object,
  settings: PropTypes.object,
  plugins: PropTypes.array,
  onChange: PropTypes.func
}

TextEditor.defaultProps = {
  placeholder: 'Type something…',
  defaultValue: '',
  input: null,
  disabled: false,
  meta: null,
  plugins: [],
  settings: {},
  onChange: () => {}
}
