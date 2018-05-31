import React from 'react'

import Field from './field'

export default class ImportantDates extends React.Component {
  render() {
    return (
      <div className="c-contact-profile-card">
        <h3 className="c-contact-profile-card__title">Important Dates</h3>
        <div className="c-contact-profile-card__body">
          <Field contact={this.props.contact} />
        </div>
      </div>
    )
  }
}
