import React from 'react'
import { connect } from 'react-redux'
import PageTitle from '../components/PageTitle'
import Catalog from './components/ProfileCatalog'
import CoverImage from './components/CoverImage'
import PersonalInfo from './components/PersonalInfo'
import ChangePassword from './components/ChangePassword'

const Profile = ({ user }) => (
  <div>
    <PageTitle title="Profile" />
    <div>
      <Catalog user={user} />
      <PersonalInfo />
      <ChangePassword />
      {user.user_type === 'Agent' && <CoverImage />}
    </div>
  </div>
)

export default connect(({ user }) => ({ user }))(Profile)
