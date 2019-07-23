import React, { useEffect } from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'

import getDefaultHomePage from '../../../utils/get-default-home-page'

function GoToDashboard(props) {
  let to = '/signin'

  if (props.user) {
    to = getDefaultHomePage(props.user)
  }

  useEffect(() => {
    browserHistory.push(to)
  }, [to])

  return null
}

export default connect(({ user }) => ({ user }))(GoToDashboard)
