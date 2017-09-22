import React from 'react'
import { connect } from 'react-redux'
import CoverImage from './components/CoverImage'
import PersonalInfo from './components/PersonalInfo'
import ChangePassword from './components/ChangePassword'

const Profile = ({ user }) => (
  <div>
    <PersonalInfo />
    <ChangePassword />
    {user.brand && user.agent && <CoverImage />}
  </div>
)

export default connect(({ user }) => ({ user }))(Profile)
