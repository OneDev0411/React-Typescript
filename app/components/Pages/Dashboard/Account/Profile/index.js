import React from 'react'
import { connect } from 'react-redux'

const Account = ({ user }) => <h2>Profile</h2>

export default connect(({ user }) => ({ user }))(Account)
