import React from 'react'

import Emails from './fields/Emails'
import Phones from './fields/Phones'
import Companies from './fields/Companies'
import JobTitles from './fields/JobTitles'
import { Source } from './fields/Source'
import Websites from './fields/Websites'
import OrginalSource from './fields/OrginalSource'

export default function Details({ contact }) {
  return (
    <div className="c-contact-profile-card">
      <h3 className="c-contact-profile-card__title">Details</h3>
      <Emails contact={contact} />

      <Phones contact={contact} />

      <JobTitles contact={contact} />

      <Companies contact={contact} />

      <Source contact={contact} />

      <Websites contact={contact} />

      <OrginalSource contact={contact} />
    </div>
  )
}
