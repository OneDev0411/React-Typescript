// Branch.js
import React from 'react'
import Branch from 'branch-sdk'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import config from '../../../config/public'
import Loading from '../Partials/Loading'
import getUser from '../../models/user/get-user'

const OOPS_PAGE = '/oops'
const branchKey = config.branch.key

export const getActionRedirectURL = params => {
  const { action, room, alert, listing } = params

  if (action === 'RedirectToRoom' && room) {
    return `/dashboard/recents/${room}`
  }

  if (action === 'RedirectToAlert' && alert) {
    return `/dashboard/mls/alerts/${alert}`
  }

  if (action === 'RedirectToListing' && listing) {
    return `/dashboard/mls/${listing}`
  }

  return '/dashboard/mls/'
}

const generateRedirect = (actionType, branchData, isLoggedIn) => {
  let redirect
  Object.keys(branchData).forEach(key => {
    if (key === 'email' || key === 'phone_number') {
      branchData[key] = encodeURIComponent(branchData[key])
    }
  })

  const {
    code,
    room,
    token,
    alert,
    email,
    action,
    listing,
    isShadow,
    email_code,
    phone_number,
    receivingUser
  } = branchData

  if (actionType === 'VERIFY') {
    // console.log('verify')
    redirect = '/verify/confirm/'

    switch (action) {
      case 'EmailVerification':
        redirect += `email?email=${email}&email_code=${email_code}`
        break
      case 'PhoneVerification':
        redirect += `phone?phone_number=${phone_number}&code=${code}`
        break
      default:
        break
    }

    return redirect
  }

  if (isShadow) {
    // console.log('isShadow:')
    if (token) {
      redirect = `register?token=${token}`

      if (listing) {
        redirect = `/dashboard/mls/${listing}?token=${token}`
      }

      if (phone_number) {
        redirect += `&phone_number=${phone_number}`
      }

      if (email) {
        redirect += `&email=${email}`
      }

      redirect += `&redirectTo=${encodeURIComponent(
        getActionRedirectURL(branchData)
      )}`
    } else {
      // console.log('token broken')
      return OOPS_PAGE
    }
  } else if (isLoggedIn) {
    if (receivingUser.id === isLoggedIn.id) {
      // console.log('loggedIn')
      redirect = getActionRedirectURL(branchData)
    } else {
      // show modal you logged in with different user
      // console.log('you logged with deferent user')
      redirect = OOPS_PAGE
    }
  } else {
    // show modal you are register before with this user please logged in
    // console.log('you registered before with this email')
    redirect = '/signin?'

    if (listing) {
      redirect = `/dashboard/mls/${listing}?`
    }

    if (email === receivingUser.email) {
      redirect += `username=${email}`
    } else {
      redirect += `username=${encodeURIComponent(receivingUser.email)}`
    }

    redirect += `&redirectTo=${encodeURIComponent(
      getActionRedirectURL(branchData)
    )}`
  }

  return redirect
}

const branch = ({ isLoggedIn }) => {
  Branch.init(branchKey, async (err, { data_parsed }) => {
    if (err) {
      browserHistory.push(OOPS_PAGE)
    }

    let redirect = OOPS_PAGE
    const { receiving_user, action } = data_parsed

    if (action) {
      if (action.indexOf('Verification') !== -1) {
        redirect = generateRedirect('VERIFY', data_parsed)
      } else if (receiving_user) {
        try {
          const receivingUser = await getUser(receiving_user)
          const { is_shadow: isShadow } = receivingUser
          delete data_parsed.receiving_user
          data_parsed = {
            ...data_parsed,
            isShadow,
            receivingUser
          }
          redirect = generateRedirect('OTHER', data_parsed, isLoggedIn)
        } catch (err) {
          // console.log(err)
        }
      }
      browserHistory.push(redirect)
    } else {
      browserHistory.push(redirect)
    }
  })

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Loading />
    </div>
  )
}

export default connect(({ user }) => ({
  isLoggedIn: Object.keys(user).length > 0 ? user : null
}))(branch)
