import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import addNewAttributes from '../../../../../../store_actions/contacts/add-new-attributes'

class AddNote extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      note: '',
      saving: false
    }

    this.handelAddNote = this.handelAddNote.bind(this)
  }

  async handelAddNote() {
    const { note } = this.state
    const { contactId, addNewAttributes } = this.props

    if (note.trim().length === 0) {
      return
    }

    this.setState({ saving: true })

    // save note
    await addNewAttributes({
      contactId,
      attributes: [
        {
          note,
          type: 'note'
        }
      ]
    })

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
            onClick={this.handelAddNote}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    )
  }
}

export default connect(null, { addNewAttributes })(AddNote)
