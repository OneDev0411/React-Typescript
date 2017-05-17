import React from 'react'
import _ from 'underscore'
import moment from 'moment'

export default ({
  notes
}) => (
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
          {
            item.note.split('\n').map((text, key) => (
              <div key={`item_${item.id}_line_${key}`}>
                {text}
              </div>
            ))
          }
          <span className="time">
            { moment.unix(item.created_at ).format('MMMM DD, YYYY')}
          </span>
        </div>
      ))
    }
  </div>
)
