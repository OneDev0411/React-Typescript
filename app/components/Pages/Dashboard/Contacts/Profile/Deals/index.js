import React from 'react'

import ActionButton from '../../../../../../views/components/Button/ActionButton'

export default class Deals extends React.Component {
  render() {
    return (
      <div className="c-contact-profile-card stage">
        <h3 className="c-contact-profile-card__title">Deals</h3>
        <div
          center
          className="c-contact-profile-card__body"
          style={{ textAlign: 'center' }}
        >
          <ActionButton style={{ marginRight: '1em' }}>Add Deal</ActionButton>
          <ActionButton>Create Deal</ActionButton>
        </div>
      </div>
    )
  }
}
