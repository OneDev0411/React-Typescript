import React from 'react'
import FormCard from './FormCard'
import AvatarUploader from './AvatarUploader'

const ProfileCatalog = ({ user }) => {
  const { first_name, last_name, email, phone_number } = user
  const full_name = `${first_name} ${last_name}`

  return (
    <div className="c-profile-catalog">
      <FormCard>
        <AvatarUploader user={user} />
        <ul className="c-profile-catalog__list u-unstyled-list">
          <li className="c-profile-catalog__item--big">{full_name}</li>
          <li className="c-profile-catalog__item--small">{phone_number}</li>
          <li className="c-profile-catalog__item--small">{email}</li>
        </ul>
      </FormCard>
    </div>
  )
}

export default ProfileCatalog
