// Branch.js
import React from 'react'
import Branch from 'branch-sdk'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import { browserHistory } from 'react-router'

import config from '../../../../config/public'

import Loading from '../../Partials/Loading'
import { getBrandInfo } from '../Auth/SignIn'
import getUser from '../../../models/user/get-user'
import ConflictModal from './components/ConflictModal'
import VerifyRedirectModal from './components/VerifyRedirectModal'

const OOPS_PAGE = '/oops'
const branchKey = config.branch.key

const getActionRedirectURL = params => {
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

const generateVerificationActionRedirectUrl = params => {
  let url = '/verify/confirm/'
  const { action, email, email_code, phone_number, code } = params

  switch (action) {
    case 'EmailVerification':
      url += `email?email=${email}&email_code=${email_code}`
      break
    case 'PhoneVerification':
      url += `phone?phone_number=${phone_number}&code=${code}`
      break
    default:
      url = OOPS_PAGE
      break
  }

  return url
}

const redirectHandler = (
  actionType,
  branchData,
  loggedInUser,
  setActiveModal
) => {
  let redirect

  Object.keys(branchData).forEach(key => {
    if (key === 'email' || key === 'phone_number') {
      branchData[key] = encodeURIComponent(branchData[key])
    }
  })

  const {
    room,
    token,
    alert,
    email,
    action,
    listing,
    isShadow,
    phone_number,
    receivingUser
  } = branchData

  const params = { action, loggedInUser, receivingUser }
  const hasConflict = () => loggedInUser && receivingUser.id !== loggedInUser.id

  if (actionType === 'VERIFY') {
    // console.log('verify')
    redirect = generateVerificationActionRedirectUrl(branchData)

    if (hasConflict()) {
      // console.log('different user logged in with receiving user')
      params.redirectTo = encodeURIComponent(redirect)

      setActiveModal({ name: 'VERIFYING_CONFLICT', params })
      return
    }
  } else if (isShadow) {
    // console.log('isShadow:')
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

    if (hasConflict()) {
      // console.log('you logged with different user')
      params.redirectTo = encodeURIComponent(redirect)
      params.messageText =
        'meesage for shadow conflict when user logged in already'
      setActiveModal({ name: 'SHADOW_CONFLICT', params })
      return
    }
  } else if (loggedInUser) {
    // console.log('loggedIn')
    redirect = getActionRedirectURL(branchData)

    if (hasConflict()) {
      // console.log('you logged with deferent user')
      params.redirectTo = encodeURIComponent(redirect)
      params.messageText =
        'meesage for normal conflict when user loggedin with different user'
      setActiveModal({ name: 'CONFLICT', params })
      return
    }
  } else {
    // console.log('you registered before with this email')

    const username = `username=${encodeURIComponent(receivingUser.email)}`
    redirect = !listing
      ? `/signin?${username}&redirectTo=`
      : `/dashboard/mls/${listing}?${username}&redirectTo=`
    redirect += encodeURIComponent(getActionRedirectURL(branchData))
  }

  browserHistory.push(redirect)
}

const branch = ({
  loggedInUser,
  brand,
  activeModal,
  setActiveModal,
  branchData,
  setBranchData
}) => {
  if (!branchData) {
    Branch.init(branchKey, (err, { data_parsed }) => {
      if (err) {
        console.log(err)
        browserHistory.push(OOPS_PAGE)
      }

      setBranchData(data_parsed)
    })
  } else {
    const { receiving_user, action } = branchData

    if (action) {
      if (receiving_user) {
        getUser(receiving_user)
          .then(receivingUser => {
            const {
              email_confirmed,
              phone_confirmed,
              is_shadow: isShadow
            } = receivingUser

            delete branchData.receiving_user

            branchData = {
              ...branchData,
              isShadow,
              receivingUser
            }

            if (action.indexOf('Verification') !== -1) {
              const { email_code, code } = branchData

              if (
                (email_code && !email_confirmed) ||
                (code && !phone_confirmed)
              ) {
                redirectHandler(
                  'VERIFY',
                  branchData,
                  loggedInUser,
                  setActiveModal
                )
                return
              }

              setActiveModal({ name: 'VERIFIED', params: { receivingUser } })
              return
            }

            redirectHandler('OTHER', branchData, loggedInUser, setActiveModal)
          })
          .catch(err => {
            // console.log(err)
            browserHistory.push(OOPS_PAGE)
          })
      }
    } else {
      // console.log('last oops in last else')
      browserHistory.push(OOPS_PAGE)
    }
  }

  let content = <Loading />
  if (activeModal) {
    const brandInfo = getBrandInfo(brand)
    const { name, params } = activeModal
    switch (name) {
      case 'CONFLICT':
      case 'SHADOW_CONFLICT':
      case 'PROTECTED_RESOURCE':
        content = <ConflictModal params={params} brandInfo={brandInfo} />
        break
      case 'VERIFYING_CONFLICT':
        content = (
          <VerifyRedirectModal
            type={name}
            params={params}
            brandInfo={brandInfo}
          />
        )
        break
      case 'VERIFIED':
        content = (
          <VerifyRedirectModal
            type={name}
            params={params}
            brandInfo={brandInfo}
          />
        )
        break
      default:
        break
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {content}
    </div>
  )
}

export default compose(
  connect(({ user: loggedInUser, brand }) => ({
    brand,
    loggedInUser
  })),
  withState('branchData', 'setBranchData', null),
  withState('activeModal', 'setActiveModal', null)
)(branch)
