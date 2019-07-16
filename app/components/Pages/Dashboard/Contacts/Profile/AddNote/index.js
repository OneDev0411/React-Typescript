import React, { createRef } from 'react'

import styled from 'styled-components'

import { TextEditor } from 'components/TextEditor'

import ActionButton from '../../../../../../views/components/Button/ActionButton'

export const Form = styled.form`
  padding: 0 1em 1em;
`

export const Actions = styled.div`
  text-align: right;
  margin-top: 1.5em;
`

export class AddNote extends React.Component {
  textEditorRef = createRef()

  state = {
    isEmpty: true,
    isSaving: false
  }

  handleOnChange = () => {
    let editorRef = this.textEditorRef.current

    this.setState({
      isEmpty: !editorRef || !editorRef.getPlainText().trim()
    })
  }

  handleAddNote = async event => {
    event.preventDefault()

    this.setState({ isSaving: true })

    // save note
    await this.props.onSubmit(this.textEditorRef.current.getHtml())

    this.setState({
      isSaving: false
    })

    this.textEditorRef.current.reset()
  }

  render() {
    const { isSaving, isEmpty } = this.state

    return (
      <Form onSubmit={this.handleAddNote}>
        <TextEditor
          ref={this.textEditorRef}
          hasImage
          disabled={isSaving}
          placeholder="Add your note…"
          onChange={this.handleOnChange}
        />
        {!isEmpty && (
          <Actions>
            <ActionButton type="submit" disabled={isSaving}>
              {isSaving ? 'Adding...' : 'Add'}
            </ActionButton>
          </Actions>
        )}
      </Form>
    )
  }
}
