import React from 'react'
import _ from 'underscore'
import moment from 'moment'
import Editable from '../Editable'

export default class extends React.Component {

  nl2br(item) {
    return item.note.split('\n').map((text, key) => (
      <div key={`item_${item.id}_line_${key}`}>
        { text }
      </div>
    ))
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
          notes.map(item => {
            // const text = this.nl2br(item)

            return (
              <div key={`note_${item.id}`} className="item">
                <Editable
                  type="note"
                  id={item.id}
                  showEdit={true}
                  showAdd={false}
                  text={item.note}
                />
                <span className="time">
                  { moment.unix(item.created_at ).format('MMMM DD, YYYY')}
                </span>
              </div>
            )
          })
        }
      </div>
    )
  }
}
