// Branch.js
import React from 'react'
import Branch from 'branch-sdk'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import { browserHistory } from 'react-router'

import publicConfig from '../../../../config/public'

import signin from '../../../store_actions/auth/signin'

import Loading from '../../Partials/Loading'
import { getBrandInfo } from '../Auth/SignIn/get-brand-info'
import getUser from '../../../models/user/get-user'
import ConflictModal from './components/ConflictModal'
import NeedsToLoginModal from './components/NeedsToLoginModal'
import VerifyRedirectModal from './components/VerifyRedirectModal'

const OOPS_PAGE = '/oops'
const branchKey = publicConfig.branch.key

const getConfilictMessageText = email =>
  `You are currently logged in a different user.  Please sign out and sign in using ${email}.`

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
  const {
    action,
    email,
    email_code,
    phone_number,
    phone_code,
    receivingUser
  } = params

  switch (action) {
    case 'EmailVerification':
      url += `email?email=${email}&email_code=${email_code}`
      break
    case 'PhoneVerification':
      // eslint-disable-next-line
      url += `phone?phone_number=${phone_number}&phone_code=${phone_code}&receivingUserEmail=${
        receivingUser.email
      }`
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

  const {
    token,
    email,
    action,
    listing,
    isShadow,
    phone_number,
    receivingUser
  } = branchData

  const branchUrl = branchData['~referring_link']

  const params = {
    action,
    loggedInUser,
    receivingUser,
    branchUrl
  }
  const hasConflict = () => loggedInUser && receivingUser.id !== loggedInUser.id

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
  } else if (isShadow) {
    // console.log('isShadow:')
    redirect = `register?token=${token}`

    if (listing) {
      redirect = `/dashboard/mls/${listing}?token=${token}`
    } else if (actionType === 'UserActivation') {
      const { first_name, last_name } = receivingUser

      if (
        first_name &&
        first_name !== decodeURIComponent(email) &&
        first_name !== encodeURIComponent(phone_number)
      ) {
        redirect += `&firstName=${first_name}`
      }

      if (last_name) {
        redirect += `&lastName=${last_name}`
      }
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
        'You are currently logged in a different user. Please sign out and sign up your new account.'
      setActiveModal({ name: 'SHADOW_CONFLICT', params })

      return
    }
  } else if (actionType === 'UserLogin') {
    const loginHandler = () =>
      dispatch(
        signin(
          {
            refresh_token: branchData.refresh_token.token,
            grant_type: 'refresh_token',
            client_id: branchData.refresh_token.client
          },
          undefined,
          branchData.refresh_token.user
        )
      )

    if (hasConflict()) {
      setActiveModal({
        name: 'CONFLICT',
        params: {
          ...params,
          messageText: getConfilictMessageText(receivingUser.email),
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
    // console.log('loggedIn')
    redirect = getActionRedirectURL(branchData)

    if (hasConflict()) {
      // console.log('you logged with deferent user')
      params.redirectTo = encodeURIComponent(redirect)
      params.messageText = getConfilictMessageText(receivingUser.email)
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
  setBranchData,
  dispatch,
  waitingForRedirect
}) => {
  if (!branchData) {
    Branch.init(branchKey, (err, { data_parsed }) => {
      if (err) {
        // console.log(err)
        browserHistory.push(OOPS_PAGE)
      }

      setBranchData(data_parsed)
    })
  } else if (!waitingForRedirect) {
    const { receiving_user, action } = branchData

    if (action) {
      if (action === 'ShareTemplateInstance') {
        browserHistory.push({ pathname: '/share', state: branchData })
      } else if (receiving_user) {
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

            if (action.includes('Verification')) {
              const { email_code, phone_code } = branchData

              if (
                (email_code && !email_confirmed) ||
                (phone_code && !phone_confirmed)
              ) {
                redirectHandler(
                  'VERIFY',
                  branchData,
                  loggedInUser,
                  setActiveModal
                )

                return
              }

              setActiveModal({
                name: 'VERIFIED',
                params: {
                  receivingUser,
                  verificationType: phone_code
                    ? 'phone number'
                    : 'email address'
                }
              })

              return
            }

            redirectHandler(
              branchData.action || 'OTHER',
              branchData,
              loggedInUser,
              setActiveModal,
              dispatch
            )
          })
          // eslint-disable-next-line
          .catch(error => {
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
