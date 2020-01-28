import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import CoverImage from './components/CoverImage'
import PersonalInfo from './components/PersonalInfo'
import Timezone from './components/Timezone'
import ChangePassword from './components/ChangePassword'

const Profile = ({ user, brand }) => (
  <Fragment>
    <Helmet>
      <title>Profile | Settings | Rechat</title>
    </Helmet>
    <Fragment>
      <PersonalInfo />
      <ChangePassword />
      <Timezone brand={brand} timezone={user.timezone} />
      {user.user_type === 'Agent' && <CoverImage />}
    </Fragment>
  </Fragment>
)

export default connect(({ user, brand }) => ({ user, brand }))(Profile)
