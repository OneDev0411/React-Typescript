import React, { Fragment, useState, useCallback, useRef } from 'react'
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
import IconQuote from '../SvgIcons/Quote/IconQuote'

import { Toolbar, Separator } from './styled'

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

export function TextEditor(props) {
  const editorRef = useRef()
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(stateFromHTML(props.defaultValue))
  )

  const handleTextChange = useCallback(newState => {
    if (!newState) {
      return false
    }

    setEditorState(newState)

    const html = stateToHTML(newState.getCurrentContent())

    return props.input ? props.input.onChange(html) : props.onChange(html)
  })

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
}

TextEditor.propTypes = {
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  settings: PropTypes.object,
  plugins: PropTypes.array,
  onChange: PropTypes.func
}

TextEditor.defaultProps = {
  placeholder: 'Type something…',
  defaultValue: '',
  input: null,
  meta: null,
  plugins: [],
  settings: {},
  onChange: () => {}
}
