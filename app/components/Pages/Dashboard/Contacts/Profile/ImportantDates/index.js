import React from 'react'

import ImportanDateField from './ImportanDateField'
import { Birthday } from './Birthday'

export function ImportantDates(props) {
  return (
    <div className="c-contact-profile-card">
      <h3 className="c-contact-profile-card__title">Important Dates</h3>
      <div className="c-contact-profile-card__body">
        <Birthday contact={props.contact} />

        <ImportanDateField contact={props.contact} />
      </div>
    </div>
  )
}
