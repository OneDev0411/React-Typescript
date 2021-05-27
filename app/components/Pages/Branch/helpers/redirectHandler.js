import { browserHistory } from 'react-router'

import { createUrlSearch } from 'utils/helpers'

import submitSigninForm from '../../../../store_actions/auth/signin'

import generateVerificationActionRedirectUrl from './generateVerificationActionRedirectUrl'
import getActionRedirectURL from './getActionRedirectURL'
import getConflictMessageText from './getConflictMessageText'

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
    redirect = generateVerificationActionRedirectUrl(branchData)
    console.log('verify', branchData, redirect)

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
  } else if (actionType === 'OpenMarketingWizard') {
    const marketingWizardRedirectUrl = getActionRedirectURL(branchData)

    // If the user is wrong, ask him to relogin with the right user
    if (hasConflict()) {
      params.redirectTo = marketingWizardRedirectUrl
      params.messageText = getConflictMessageText(email)
      setActiveModal({ name: 'CONFLICT', params })

      return
    }

    // If it's logged in, just redirect as it's the right user
    if (loggedInUser) {
      browserHistory.push(marketingWizardRedirectUrl)

      return
    }

    // It it's not logged in, login and redirect
    await dispatch(
      submitSigninForm(
        {
          refresh_token: branchData.refresh_token.token,
          grant_type: 'refresh_token',
          client_id: branchData.refresh_token.client
        },
        marketingWizardRedirectUrl,
        branchData.refresh_token.user
      )
    )

    return
  } else if (userInfo && userInfo.is_shadow) {
    console.log('isShadow:', branchData)
    redirect = '/register'

    if (listing) {
      redirect = `/dashboard/mls/${listing}`
    }

    let queryParams = {
      token,
      email,
      phone_number,
      redirectTo: getActionRedirectURL(branchData)
    }

    if (hasConflict()) {
      console.log('you logged with different user')
      queryParams.redirectFromSignout = redirect
      params.to = `/signout${createUrlSearch(queryParams)}`
      params.messageText = `You are currently logged in as a different user.' 
        'Please sign out and sign up your new account.`
      setActiveModal({ name: 'SHADOW_CONFLICT', params })

      return
    }

    redirect += createUrlSearch(queryParams)
  } else if (actionType === 'UserLogin') {
    console.log('UserLogin', branchData)

    const loginHandler = () =>
      dispatch(
        submitSigninForm(
          {
            refresh_token: branchData.refresh_token.token,
            grant_type: 'refresh_token',
            client_id: branchData.refresh_token.client
          },
          branchData.uri || '/dashboard/',
          branchData.refresh_token.user
        )
      )

    if (hasConflict()) {
      console.log('UserLogin - CONFLICT')

      setActiveModal({
        name: 'CONFLICT',
        params: {
          ...params,
          messageText: getConflictMessageText(email),
          actionButtonProps: {
            onClick: loginHandler,
            text: 'Sign in'
          }
        }
      })

      return
    }

    loginHandler()

    return
  } else if (loggedInUser) {
    console.log('loggedIn', branchData)
    redirect = getActionRedirectURL(branchData)

    if (hasConflict()) {
      console.log('you logged with deferent user')
      params.redirectTo = redirect
      params.messageText = getConflictMessageText(email)
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

export default redirectHandler
