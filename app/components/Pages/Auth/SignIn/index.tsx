import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { Location } from 'history'

import { IAppState } from '../../../../reducers'

import { getUserTeams } from '../../../../store_actions/user/teams'

import * as actionsType from '../../../../constants/auth/signin'

import signin from '../../../../models/auth/signin'
import { lookupUserByEmail } from '../../../../models/user/lookup-user-by-email'

import getDefaultHomePage from '../../../../utils/get-default-home-page'

import { grey } from '../../../../views/utils/colors'

import { getBrandInfo } from './get-brand-info'
import SigninForm from './SiginForm'
import LookupUserForm from './LookupUserForm'

interface Props {
  location: Location
}

export default function Signin(props) {
  const dispatch = useDispatch()
  const brand = useSelector((state: IAppState) => state.brand)
  const { siteLogo, siteTitle, siteColor } = getBrandInfo(brand)
  const { redirectTo } = props.location.state || props.location.query

  const [username, setUsername] = useState<string>('')
  const [isLooking, setIsLooking] = useState<boolean>(false)
  const [isLoadingSignin, setIsLoadingSignin] = useState<boolean>(false)
  const [isHideLookUpForm, setIsHideLookUpForm] = useState<boolean>(false)
  const [signinError, setSigninError] = useState<string>('')
  const [lookUpFormError, setLookUpFormError] = useState<string>('')

  if (props.location.query.username) {
    setUsername(props.location.query.username)
  }

  const handleLookup = async ({ username }) => {
    try {
      setIsLooking(true)

      const response = await lookupUserByEmail(username)

      if (response.sso_url) {
        window.location.replace(response.sso_url)
      } else {
        setUsername(username)

        if (response.password) {
          setIsHideLookUpForm(true)
        }

        if (response.is_shadow) {
          setLookUpFormError('This is shadow')
        }
      }

      setIsLooking(false)
    } catch (error) {
      setIsLooking(false)

      if (error && error.response && error.response.body) {
        setLookUpFormError(error.response.body.message)
      }
    }
  }

  const handleSignin = async values => {
    try {
      setIsLoadingSignin(true)

      const user: IUser = await signin({ ...values, username })

      dispatch({
        user,
        type: actionsType.SIGNIN_SUCCESS
      })

      if (!user.teams) {
        await dispatch(getUserTeams(user))
      }

      // set user data for sentry
      // @ts-ignore
      if (window.Raven) {
        const { email, id } = user

        const userData = {
          id,
          email,
          brand: brand && {
            id: brand.id,
            name: brand.name
          }
        }

        // @ts-ignore
        window.Raven.setUserContext(userData)
      }

      const defaultHomePage = getDefaultHomePage(user)

      if (redirectTo && redirectTo.includes('http')) {
        browserHistory.push('/branch?waitingForRedirect')
        window.location.href = redirectTo

        return
      }

      browserHistory.push(redirectTo || defaultHomePage)
    } catch (error) {
      setSigninError(error.response.body.message)
      setIsLoadingSignin(false)
    }
  }

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          {siteLogo && (
            <a href="/" tabIndex={-1}>
              <img
                src={siteLogo}
                alt={`${siteTitle} logo`}
                className="c-auth__logo"
              />
            </a>
          )}
          <h1 className="c-auth__title">{siteTitle}</h1>
          <p className="c-auth__subtitle">Hi, welcome back!</p>
        </header>
        <main className="c-auth__main">
          {isHideLookUpForm ? (
            <SigninForm
              brandColor={siteColor}
              isLoading={isLoadingSignin}
              onSubmit={handleSignin}
              error={signinError}
              handleBackToLookupForm={() => setIsHideLookUpForm(false)}
            />
          ) : (
            <LookupUserForm
              brandColor={siteColor}
              isLoading={isLooking}
              onSubmit={handleLookup}
              error={lookUpFormError}
            />
          )}
          <p style={{ textAlign: 'center', color: grey.A600 }}>
            <small>Don't have an account?</small>
            &nbsp;&nbsp;
            <Link to="/signup">Sign up</Link>
          </p>
        </main>
      </article>
    </div>
  )
}
