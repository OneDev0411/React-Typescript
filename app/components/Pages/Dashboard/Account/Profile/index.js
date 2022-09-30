import React, { Fragment } from 'react'

import { useTitle } from 'react-use'

// import CoverImage from './components/CoverImage'
import ChangePassword from './components/ChangePassword'
import PersonalInfo from './components/PersonalInfo'
import Timezone from './components/Timezone'

function Profile() {
  useTitle('Profile | Settings | Rechat')

  return (
    <Fragment>
      <Fragment>
        <PersonalInfo />
        <ChangePassword />
        <Timezone />
        {/* {user.user_type === 'Agent' && <CoverImage />} */}
      </Fragment>
    </Fragment>
  )
}

export default Profile
