import React from 'react'
import Phones from './fields/Phones'
import Emails from './fields/Emails'
import Birthdays from './fields/Birthdays'
import Companies from './fields/Companies'
import JobTitles from './fields/JobTitles'
import Websites from './fields/Websites'
import OrginalSource from './OrginalSource'

export default function Details({ contact }) {
  return (
    <div className="c-contact-profile-card">
      <h3 className="c-contact-profile-card__title">Details</h3>
      <Emails contact={contact} />

      <Phones contact={contact} />

      <Birthdays contact={contact} />

      <Companies contact={contact} />

      <Websites contact={contact} />

      <JobTitles contact={contact} />

      <OrginalSource contact={contact} />
    </div>
  )
}
