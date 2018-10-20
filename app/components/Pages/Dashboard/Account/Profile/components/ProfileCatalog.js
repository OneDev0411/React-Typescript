import React from 'react'
import FormCard from './FormCard'
import Avatar from './Avatar'

const ProfileCatalog = props => {
  const { first_name, last_name, email, phone_number } = props.user
  const full_name = [first_name, last_name].join(' ').trim()

  return (
    <div className="c-profile-catalog">
      <FormCard>
        <Avatar user={props.user} />
        <ul className="c-profile-catalog__list u-unstyled-list">
          <li className="c-profile-catalog__item--big">{full_name}</li>
          {full_name !== phone_number && (
            <li className="c-profile-catalog__item--small">{phone_number}</li>
          )}
          {full_name !== email && (
            <li className="c-profile-catalog__item--small">{email}</li>
          )}
        </ul>
      </FormCard>
    </div>
  )
}

export default ProfileCatalog
