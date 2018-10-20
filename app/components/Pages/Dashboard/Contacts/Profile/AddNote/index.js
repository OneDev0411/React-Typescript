import React from 'react'
import styled from 'styled-components'

import { grey } from '../../../../../../views/utils/colors'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

const Input = styled.textarea`
  width: 100%;
  min-height: 102px;
  padding: 0;
  display: block;
  overflow: auto;
  resize: none;
  border: none;
  font-size: 1.5rem;
  font-weight: 500;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${grey.A550};
  }
`

export class AddNote extends React.Component {
  state = {
    note: '',
    isSaving: false
  }

  handleOnChange = event => {
    this.setState({ note: event.target.value })
  }

  handleAddNote = async event => {
    event.preventDefault()

    this.setState({ isSaving: true })

    // save note
    await this.props.onSubmit(this.state.note.trim())

    this.setState({
      isSaving: false,
      note: ''
    })
  }

  render() {
    const { note, isSaving } = this.state

    return (
      <form onSubmit={this.handleAddNote} style={{ padding: '1.5em' }}>
        <Input
          value={note}
          disabled={isSaving}
          placeholder="Add your note…"
          onChange={this.handleOnChange}
        />
        {note.trim().length > 0 && (
          <div style={{ textAlign: 'right', marginTop: '1.5em' }}>
            <ActionButton type="submit" disabled={isSaving}>
              {isSaving ? 'Adding...' : 'Add'}
            </ActionButton>
          </div>
        )}
      </form>
    )
  }
}
