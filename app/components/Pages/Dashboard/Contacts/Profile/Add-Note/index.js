import React from 'react'
import { Button } from 'react-bootstrap'
import store from '../../../../../../stores'
import { addNote } from '../../../../../../store_actions/contact'

export default class AddNote extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      note: '',
      saving: false
    }
  }

  async onAddNote() {
    const { note } = this.state
    const { contact_id } = this.props

    if (note.trim().length === 0)
      return

    this.setState({ saving: true })

    // save note
    await store.dispatch(addNote(contact_id, note))

    this.setState({
      saving: false,
      note: ''
    })

    // trigger onSave function
    this.props.onSave()
  }

  render() {
    const { note, saving } = this.state
    return (
      <div className="note">
        <div className="head">
          <img src="/static/images/contacts/notepad.svg" />
          New Note
        </div>
        <textarea
          placeholder="Leave a note for yourself."
          value={note}
          onChange={e => this.setState({ note: e.target.value })}
        />
        <div className="footer">
          <Button
            bsStyle="primary"
            onClick={() => this.onAddNote()}
            disabled={saving}
          >
            { saving ? 'Saving...' : 'Enter' }
          </Button>
        </div>
      </div>
    )
  }
}
