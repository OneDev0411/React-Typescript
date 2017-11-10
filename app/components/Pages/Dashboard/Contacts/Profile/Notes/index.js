import React from 'react'
import _ from 'underscore'
import moment from 'moment'
import Editable from '../Editable'

export default class extends React.Component {
  onNoteChange(type, id, text) {
    this.props.onNoteChange(type, id, text)
  }

  render() {
    const { notes } = this.props

    return (
      <div>
        {
          _.size(notes) === 0 &&
          <div className="no-note">
            <img src="/static/images/contacts/notepad-edit-231.svg" />
            <p>There are no notes yet</p>
          </div>
        }
        {
          notes.map(item => (
            <div key={`note_${item.id}`} className="item">
              <Editable
                type="note"
                id={item.id}
                showEdit
                showAdd={false}
                text={item.note}
                multiline
                onChange={(type, id, text) => this.onNoteChange(type, id, text)}
              />
              <span className="time">
                { moment.unix(item.created_at).format('MMMM DD, YYYY')}
              </span>
            </div>
          ))
        }
      </div>
    )
  }
}
