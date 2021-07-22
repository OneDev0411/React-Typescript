import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'

// import CoverImage from './components/CoverImage'
import ChangePassword from './components/ChangePassword'
import PersonalInfo from './components/PersonalInfo'
import Timezone from './components/Timezone'

function Profile() {
  return (
    <Fragment>
      <Helmet>
        <title>Profile | Settings | Rechat</title>
      </Helmet>
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
