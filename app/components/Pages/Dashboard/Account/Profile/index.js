import React from 'react'
import { connect } from 'react-redux'
import PersonalInfo from './components/PersonalInfo'
import ChangePassword from './components/ChangePassword'

const Account = () => (
  <div>
    <PersonalInfo />
    <ChangePassword />
  </div>
)

export default Account
