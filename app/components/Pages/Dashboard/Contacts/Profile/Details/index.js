import React from 'react'
import Contact from '../../../../../../models/Contact'
import Phones from './phones'
import Emails from './emails'
import Birthdays from './birthdays'
import Companies from './companies'
import Jobs from './jobs'
import Websites from './websites'

export default function Details({
  contact,
  onAddAttribute,
  onChangeAttribute
}) {
  return (
    <div className="card details">
      <div className="title">Details</div>
      <ul className="table">
        <Emails
          emails={Contact.get.attribute({
            contact,
            name: 'emails',
            type: 'email'
          })}
          onAddAttribute={onAddAttribute}
          onChangeAttribute={onChangeAttribute}
        />

        <Phones
          phones={Contact.get.attribute({
            contact,
            name: 'phone_numbers',
            type: 'phone_number'
          })}
          onAddAttribute={onAddAttribute}
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
          companies={Contact.get.attribute({
            contact,
            name: 'companies',
            type: 'company'
          })}
          onAddAttribute={onAddAttribute}
          onChangeAttribute={onChangeAttribute}
        />

        <Websites
          websites={Contact.get.attribute({
            contact,
            name: 'websites',
            type: 'website'
          })}
          onAddAttribute={onAddAttribute}
          onChangeAttribute={onChangeAttribute}
        />

        <Jobs
          jobs={Contact.get.attribute({
            contact,
            name: 'job_titles',
            type: 'job_title'
          })}
          onAddAttribute={onAddAttribute}
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
