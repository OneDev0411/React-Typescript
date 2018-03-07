import React from 'react'
import AddNoteIcon from '../../../../../../views/components/SvgIcons/AddNote'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

class AddNote extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      note: '',
      isSaving: false
    }

    this.handleAddNote = this.handleAddNote.bind(this)
  }

  handleOnChange = event => {
    this.setState({ note: event.target.value })
  }

  async handleAddNote(event) {
    event.preventDefault()

    const { note } = this.state
    const { onSubmit } = this.props

    if (!note) {
      return
    }

    this.setState({ isSaving: true })

    // save note
    await onSubmit(note.trim())

    this.setState({
      isSaving: false,
      note: ''
    })
  }

  render() {
    const { note, isSaving } = this.state

    return (
      <form
        onSubmit={this.handleAddNote}
        className="c-add-note c-contact-profile-card"
      >
        <div className="c-add-note__header">
          <AddNoteIcon color="#4A4A4A" />
          <h3 className="c-add-note__title">New Note</h3>
        </div>
        <div className="c-add-note__body">
          <textarea
            value={note}
            disabled={isSaving}
            placeholder="Leave a note for yourself."
            onChange={this.handleOnChange}
            className="c-add-note__textarea"
          />
        </div>
        <div className="c-add-note__footer">
          <ActionButton type="submit" disabled={isSaving || !note}>
            {isSaving ? 'Saving...' : 'Save'}
          </ActionButton>
        </div>
      </form>
    )
  }
}

export default AddNote
