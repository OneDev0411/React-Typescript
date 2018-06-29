import React from 'react'

import Emails from './fields/Emails'
import Phones from './fields/Phones'
import { Source } from './fields/Source'
import Websites from './fields/Websites'
import OrginalSource from './fields/OrginalSource'

export default function Details({ contact }) {
  return (
    <div className="c-contact-profile-card">
      <h3 className="c-contact-profile-card__title">Contact info</h3>
      <Emails contact={contact} />

      <Phones contact={contact} />

      <Source contact={contact} />

      <Websites contact={contact} />

      <OrginalSource contact={contact} />
    </div>
  )
}
