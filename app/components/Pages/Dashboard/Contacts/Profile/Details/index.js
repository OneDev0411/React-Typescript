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
    <div className="card details">
      <div className="title">Details</div>
      <ul className="table">
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

        <li>
          <div className="name">Original Source</div>
          <div className="data">{Contact.get.source(contact).label || '-'}</div>
        </li>
      </ul>
    </div>
  )
}
