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

const generateRedirect = (actionType, branchData, isLoggedIn, isShadow) => {
  let redirect
  Object.keys(branchData).forEach(key => {
    branchData[key] = encodeURIComponent(branchData[key])
  })

  const {
    code,
    room,
    token,
    alert,
    email,
    action,
    listing,
    email_code,
    phone_number,
    receiving_user
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
    // console.log('isShadow')
    if (token) {
      redirect = `register?token=${token}`

      if (listing) {
        redirect = `/dashboard/mls/${listing}?token=${token}`
      }

      if (phone_number) {
        redirect += `&phone_number=${phone_number}`
      } else if (email) {
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
    if (receiving_user === isLoggedIn.id) {
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

    if (email) {
      redirect += `&username=${email}`
    }

    redirect += `&redirectTo=${encodeURIComponent(
      getActionRedirectURL(branchData)
    )}`
  }

  return redirect
}

const branch = ({ user }) => {
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
          const { is_shadow } = await getUser(receiving_user)
          redirect = generateRedirect('OTHER', data_parsed, user, is_shadow)
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

export default connect(({ user }) => ({ user }))(branch)
