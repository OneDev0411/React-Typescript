import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'

import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'

import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'

const richButtonsPlugin = createRichButtonsPlugin()

import { InputError } from 'components/Forms/styled'

import { Toolbar, ToolbarRow } from './styled'

export function TextEditor(props) {
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

  const {
    ItalicButton,
    BoldButton,
    MonospaceButton,
    UnderlineButton,
    BlockquoteButton,
    OLButton,
    ULButton,
    H1Button,
    H2Button,
    H3Button,
    H4Button,
    H5Button,
    H6Button
  } = richButtonsPlugin

  return (
    <div>
      <Toolbar>
        <ToolbarRow>
          <H1Button />
          <H2Button />
          <H3Button />
          <H4Button />
          <H5Button />
          <H6Button />
          <BlockquoteButton />
          <ULButton />
          <OLButton />
        </ToolbarRow>

        <ToolbarRow>
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <MonospaceButton />
        </ToolbarRow>
      </Toolbar>

      <Editor
        spellCheck
        editorState={editorState}
        onChange={handleTextChange}
        plugins={[richButtonsPlugin, ...props.plugins]}
        placeholder={props.placeholder}
        {...props.settings}
      />

      {props.meta && props.meta.error && props.meta.touched && (
        <InputError style={{ marginTop: '0.5rem' }}>
          {props.meta.error}
        </InputError>
      )}
    </div>
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
