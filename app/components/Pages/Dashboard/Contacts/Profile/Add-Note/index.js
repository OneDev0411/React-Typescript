import React from 'react'
import { Button } from 'react-bootstrap'
import Dispatcher from '../../../../../../dispatcher/ContactDispatcher'

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
    const { user, contact_id } = this.props

    if (note.trim().length === 0)
      return

    this.setState({ saving: true })

    // save note
    await Dispatcher.dispatchSync({
      action: 'add-note',
      id: contact_id,
      user,
      note
    })

    this.setState({ saving: false })

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
          placeholder="What do you want to say?"
          value={note}
          onChange={e => this.setState({ note: e.target.value }) }
        ></textarea>
        <div className="footer">
          <Button
            bsStyle="danger"
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
