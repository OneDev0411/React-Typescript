import React from 'react'
import _ from 'underscore'
import moment from 'moment'
import Editable from '../Editable'

export default function Notes(props) {
  const { notes, onNoteChange } = props

  return (
    <div>
      {_.size(notes) === 0 && (
        <div className="no-note">
          <img
            alt="notepad"
            src="/static/images/contacts/notepad-edit-231.svg"
          />
          <p>There are no notes yet</p>
        </div>
      )}
      {notes.map(item => (
        <div key={`note_${item.id}`} className="item">
          <Editable
            type="note"
            id={item.id}
            showEdit
            showAdd={false}
            text={item.note}
            multiline
            onChange={(type, id, text) => onNoteChange(type, id, text)}
          />
          <span className="time">
            {moment.unix(item.created_at).format('MMMM DD, YYYY')}
          </span>
        </div>
      ))}
    </div>
  )
}
