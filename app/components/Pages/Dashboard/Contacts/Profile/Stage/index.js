import React from 'react'
import Stepper from '../../../../../Partials/Stepper'
import Contact from '../../../../../../models/contacts'

const STEPS = [
  'General',
  'Unqualified Lead',
  'Qualified Lead',
  'Active',
  'Past Client'
]

export default function Stage({ contact, handleOnChange }) {
  const getStageIndex = () => {
    const list = [
      'General',
      'UnqualifiedLead',
      'QualifiedLead',
      'Active',
      'PastClient'
    ]
    const stage = Contact.get.stage(contact)

    return list.indexOf(stage.name)
  }

  return (
    <div className="c-contact-profile-card stage">
      <h3 className="c-contact-profile-card__title">Stage</h3>
      <div className="c-contact-profile-card__body">
        <Stepper
          steps={STEPS}
          active={getStageIndex()}
          onChange={handleOnChange}
        />
      </div>
    </div>
  )
}
