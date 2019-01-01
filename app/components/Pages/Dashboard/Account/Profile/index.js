import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import CoverImage from './components/CoverImage'
import PersonalInfo from './components/PersonalInfo'
import Timezone from './components/Timezone'
import ChangePassword from './components/ChangePassword'
import PageHeader from '../../../../../views/components/PageHeader'

const Profile = ({ user, brand }) => (
  <Fragment>
    <PageHeader isFlat style={{ marginBottom: '1.5em', marginTop: '1.5rem' }}>
      <PageHeader.Title showBackButton={false}>
        <PageHeader.Heading>Profile</PageHeader.Heading>
      </PageHeader.Title>
    </PageHeader>
    <Fragment>
      <PersonalInfo />
      <ChangePassword />
      <Timezone brand={brand} timezone={user.timezone} />
      {user.user_type === 'Agent' && <CoverImage />}
    </Fragment>
  </Fragment>
)

export default connect(({ user, brand }) => ({ user, brand }))(Profile)
