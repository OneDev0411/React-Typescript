import React from 'react'
import Contact from '../../../../../../models/contacts'
import Phones from './phones'
import Emails from './emails'
import Birthdays from './birthdays'
import Companies from './companies'
import Jobs from './jobs'
import Websites from './websites'

export default function Details({ contact, onChangeAttribute }) {
  return (
    <div className="c-contact-profile-card">
      <h3 className="c-contact-profile-card__title">Details</h3>
      <Emails
        items={Contact.get.attribute({
          contact,
          name: 'emails',
          type: 'email'
        })}
        onChangeAttribute={onChangeAttribute}
      />

      <Phones
        items={Contact.get.attribute({
          contact,
          name: 'phone_numbers',
          type: 'phone_number'
        })}
        onChangeAttribute={onChangeAttribute}
      />

      <Birthdays
        birthdays={Contact.get.attribute({
          contact,
          name: 'birthdays',
          type: 'birthday'
        })}
        onChangeAttribute={onChangeAttribute}
      />

      <Companies
        items={Contact.get.attribute({
          contact,
          name: 'companies',
          type: 'company'
        })}
        onChangeAttribute={onChangeAttribute}
      />

      <Websites
        items={Contact.get.attribute({
          contact,
          name: 'websites',
          type: 'website'
        })}
        onChangeAttribute={onChangeAttribute}
      />

      <Jobs
        items={Contact.get.attribute({
          contact,
          name: 'job_titles',
          type: 'job_title'
        })}
        onChangeAttribute={onChangeAttribute}
      />

      <div className="c-contact-detail-item" style={{ marginBottom: 0 }}>
        <span className="c-contact-detail-item__label">Original Source</span>
        <span className="c-contact-detail-item__field">
          {Contact.get.source(contact).label || '-'}
        </span>
      </div>
    </div>
  )
}
