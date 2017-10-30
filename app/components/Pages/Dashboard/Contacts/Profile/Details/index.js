import React from 'react'
import { connect } from 'react-redux'
import Contact from '../../../../../../models/Contact'
import Tags from '../Tags'
import Phones from './phones'
import Emails from './emails'
import Birthdays from './birthdays'

const Details = ({
  contact,
  user,
  emails,
  phones,
  birthdays,
  onAddAttribute,
  onChangeAttribute,
  defaultTags
}) => (
  <div className="card details">
    <div className="title">Details</div>
    <ul className="table">
      <li>
        <div className="name">Tags</div>
        <div className="data">
          <Tags
            contact_id={contact.id}
            user={user}
            tags={Contact.get.tags(contact, defaultTags)}
          />
        </div>
      </li>

      <Emails
        emails={emails}
        onAddAttribute={onAddAttribute}
        onChangeAttribute={onChangeAttribute}
      />

      <Phones
        phones={phones}
        onAddAttribute={onAddAttribute}
        onChangeAttribute={onChangeAttribute}
      />

      <Birthdays
        birthdays={birthdays}
        onAddAttribute={onAddAttribute}
        onChangeAttribute={onChangeAttribute}
      />

      <li>
        <div className="name">Original Source</div>
        <div className="data">
          { Contact.get.source(contact).label || '-' }
        </div>
      </li>
    </ul>
  </div>
)

export default connect(({ contacts }) => ({
  defaultTags: contacts.tags
}))(Details)
