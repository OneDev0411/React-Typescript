import React from 'react'
import branch from 'recompose/branch'
import compose from 'recompose/compose'
import renderNothing from 'recompose/renderNothing'

const hideIfNotLoggedIn = hasNoData => branch(hasNoData, renderNothing)

const enhance = hideIfNotLoggedIn(props => props.isLoggedIn)

const RegisterOrLoginMessage = enhance(({ isLoggedIn }) =>
  <p className="c-notLoggedIn-message">
    <a href="/signup">Sign up</a> or{' '}
    <a href="/signin">log in</a>
    <span> to save listings and chat with our agents.</span>
  </p>
)

export default RegisterOrLoginMessage
