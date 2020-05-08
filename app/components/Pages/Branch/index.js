// Branch.js
import React from 'react'
import Branch from 'branch-sdk'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import { browserHistory } from 'react-router'
import idx from 'idx'

import publicConfig from '../../../../config/public'

import signin from '../../../store_actions/auth/signin'

import Loading from '../../Partials/Loading'
import { getBrandInfo } from '../Auth/SignIn/get-brand-info'
import { lookUpUserByEmail } from '../../../models/user/lookup-user-by-email'
import ConflictModal from './components/ConflictModal'
import NeedsToLoginModal from './components/NeedsToLoginModal'
import VerifyRedirectModal from './components/VerifyRedirectModal'

const OOPS_PAGE = '/oops'
const branchKey = publicConfig.branch.key

const getConfilictMessageText = email =>
  `You are currently logged in a different user.  Please sign out and sign in using ${decodeURIComponent(
    email
  )}.`

const getActionRedirectURL = params => {
  const { action, room, alert, listing, crm_task } = params

  if (action === 'RedirectToRoom' && room) {
    return `/dashboard/recents/${room}`
  }

  if (action === 'RedirectToAlert' && alert) {
    return `/dashboard/mls/saved-searches/${alert}`
  }

  if (action === 'RedirectToListing' && listing) {
    return `/dashboard/mls/${listing}`
  }

  if (crm_task && action === 'RedirectToCRMTask') {
    return `/dashboard/notifications/crm/${crm_task}`
  }

  if (action === 'RedirectToContact') {
    return `/dashboard/contacts/${params.contact}`
  }

  if (action === 'RedirectToDeal') {
    return `/dashboard/deals/${params.deal}`
  }

  return '/dashboard/mls/'
}

const generateVerificationActionRedirectUrl = params => {
  let url = '/verify/confirm/'
  const { action, email, email_code, phone_number, phone_code } = params

  switch (action) {
    case 'EmailVerification':
      url += `email?email=${email}&email_code=${email_code}`
      break
    case 'PhoneVerification':
      // eslint-disable-next-line
      url += `phone?phone_number=${phone_number}&phone_code=${phone_code}`
      break
    default:
      url = OOPS_PAGE
      break
  }

  return url
}

const redirectHandler = async (
  actionType,
  branchData,
  loggedInUser,
  setActiveModal,
  dispatch
) => {
  let redirect

  Object.keys(branchData).forEach(key => {
    if (key === 'email' || key === 'phone_number') {
      branchData[key] = encodeURIComponent(branchData[key])
    }
  })

  let {
    token,
    email,
    action,
    listing,
    phone_number,
    receiving_user,
    userInfo
  } = branchData

  email = email || (userInfo && userInfo.email)

  const branchUrl = branchData['~referring_link']

  const params = {
    action,
    loggedInUser,
    userInfo,
    branchUrl,
    email
  }
  const hasConflict = () =>
    loggedInUser &&
    ((receiving_user && receiving_user !== loggedInUser.id) ||
      (email && decodeURIComponent(email) !== loggedInUser.email))

  if (actionType === 'VERIFY') {
    // console.log('verify')
    redirect = generateVerificationActionRedirectUrl(branchData)

    const setParams = () => ({
      ...params,
      redirectTo: branchUrl,
      verificationType: phone_number ? 'phone number' : 'email address'
    })

    if (!loggedInUser) {
      setActiveModal({
        name: 'NEEDS_TO_LOGIN',
        params: setParams()
      })

      return
    }

    if (hasConflict()) {
      // console.log('different user logged in with receiving user')
      setActiveModal({
        name: 'VERIFYING_CONFLICT',
        params: setParams()
      })

      return
    }
  } else if (userInfo && userInfo.is_shadow) {
    console.log('isShadow:', branchData)
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

    redirect += `&redirectTo=${getActionRedirectURL(branchData)}`

    if (hasConflict()) {
      console.log('you logged with different user')
      params.redirectTo = redirect
      params.messageText =
        'You are currently logged in a different user. Please sign out and sign up your new account.'
      setActiveModal({ name: 'SHADOW_CONFLICT', params })

      return
    }
  } else if (actionType === 'UserLogin') {
    console.log('UserLogin', branchData)

    const loginHandler = () =>
      dispatch(
        signin(
          {
            refresh_token: branchData.refresh_token.token,
            grant_type: 'refresh_token',
            client_id: branchData.refresh_token.client
          },
          '/dashboard/',
          branchData.refresh_token.user
        )
      )

    if (hasConflict()) {
      console.log('UserLogin - CONFLICT')

      setActiveModal({
        name: 'CONFLICT',
        params: {
          ...params,
          messageText: getConfilictMessageText(email),
          actionButtonProps: {
            onClick: loginHandler,
            text: 'Sign in'
          }
        }
      })

      return
    }

    await loginHandler()

    return
  } else if (loggedInUser) {
    console.log('loggedIn', branchData)
    redirect = getActionRedirectURL(branchData)

    if (hasConflict()) {
      console.log('you logged with deferent user')
      params.redirectTo = redirect
      params.messageText = getConfilictMessageText(email)
      setActiveModal({ name: 'CONFLICT', params })

      return
    }
  } else {
    console.log('you registered before with this email', branchData)

    let username = ''

    if (email) {
      username = `username=${email}`
    }

    redirect = !listing
      ? `/signin?${username}&redirectTo=`
      : `/dashboard/mls/${listing}?${username}&redirectTo=`
    redirect += getActionRedirectURL(branchData)
  }

  browserHistory.push(redirect)
}

const branch = ({
  loggedInUser,
  brand,
  activeModal,
  setActiveModal,
  branchData,
  setBranchData,
  dispatch,
  waitingForRedirect
}) => {
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
      case 'VERIFIED':
      case 'VERIFYING_CONFLICT':
        content = (
          <VerifyRedirectModal
            type={name}
            params={params}
            brandInfo={brandInfo}
          />
        )
        break
      case 'NEEDS_TO_LOGIN':
        content = <NeedsToLoginModal params={params} brandInfo={brandInfo} />
        break
      default:
        break
    }
  } else if (!branchData) {
    Branch.init(
      branchKey,
      {
        retries: 30,
        retry_delay: 3000
      },
      async (err, data) => {
        if (err) {
          console.log('Init - error', err, data)
          browserHistory.push('/oops')
        }

        if (idx(data, d => d.data_parsed.action)) {
          let userInfo = null

          console.log('Init - success', data)

          if (data.data_parsed.email) {
            try {
              userInfo = await lookUpUserByEmail(data.data_parsed.email)
            } catch (error) {
              console.log(error)
            }
          }

          setBranchData({
            ...data.data_parsed,
            userInfo
          })
        } else {
          console.log('Init - success but with corrupted data', data)
        }
      }
    )
  } else if (!waitingForRedirect) {
    const { userInfo, action } = branchData

    if (action) {
      if (action === 'ShareTemplateInstance') {
        browserHistory.push({ pathname: '/share', state: branchData })
      } else if (action.includes('Verification')) {
        let email_confirmed
        let phone_confirmed

        if (userInfo) {
          email_confirmed = userInfo.email_confirmed
          phone_confirmed = userInfo.phone_confirmed
        }

        const { email_code, phone_code } = branchData

        if (
          (email_code && !email_confirmed) ||
          (phone_code && !phone_confirmed)
        ) {
          redirectHandler('VERIFY', branchData, loggedInUser, setActiveModal)
        } else {
          setActiveModal({
            name: 'VERIFIED',
            params: {
              userInfo,
              verificationType: phone_code ? 'phone number' : 'email address'
            }
          })
        }
      } else {
        redirectHandler(
          branchData.action || 'OTHER',
          branchData,
          loggedInUser,
          setActiveModal,
          dispatch
        )
      }
    } else {
      console.log('last oops in last else', branchData)
      browserHistory.push(OOPS_PAGE)
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
  connect(({ user: loggedInUser, brand }, { location }) => {
    const waitingForRedirect = Object.keys(location.query).includes(
      'waitingForRedirect'
    )

    return {
      brand,
      waitingForRedirect,
      loggedInUser
    }
  }),
  withState('branchData', 'setBranchData', null),
  withState('activeModal', 'setActiveModal', null)
)(branch)
