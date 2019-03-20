import React, { useState, useCallback } from 'react'
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
import {
  CustomButton,
  CustomBlockButton,
  CustomHButton,
  TextSizeButton
} from './CutstomButtons'

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
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(stateFromHTML(props.defaultValue))
  )
  const [isOpen, setOpen] = useState(false)

  const handleTextChange = useCallback(newState => {
    if (!newState) {
      return false
    }

    setEditorState(newState)

    const html = stateToHTML(newState.getCurrentContent())

    return props.input ? props.input.onChange(html) : props.onChange(html)
  })

  return (
    <div>
      <Toolbar>
        <BoldButton>
          <CustomButton iconComponent={<IconBold />} />
        </BoldButton>

        <UnderlineButton>
          <CustomButton iconComponent={<IconUnderline />} />
        </UnderlineButton>

        <ItalicButton>
          <CustomButton iconComponent={<IconItalic />} />
        </ItalicButton>

        <Separator />

        <ULButton>
          <CustomBlockButton iconComponent={<IconList color="#333" />} />
        </ULButton>

        <OLButton>
          <CustomBlockButton iconComponent={<IconNumberedList />} />
        </OLButton>

        <Separator />

        <TextSizeButton isOpen={isOpen} setOpen={setOpen}>
          <H6Button>
            <CustomHButton title="Small" isOpen={isOpen} setOpen={setOpen} />
          </H6Button>
          <H4Button>
            <CustomHButton title="Medium" isOpen={isOpen} setOpen={setOpen} />
          </H4Button>
          <H3Button>
            <CustomHButton title="Large" isOpen={isOpen} setOpen={setOpen} />
          </H3Button>
          <H1Button>
            <CustomHButton title="Huge" isOpen={isOpen} setOpen={setOpen} />
          </H1Button>
        </TextSizeButton>

        <Separator />

        <BlockquoteButton>
          <CustomBlockButton iconComponent={<IconQuote />} />
        </BlockquoteButton>
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
