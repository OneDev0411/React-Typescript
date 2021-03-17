import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { browserHistory } from 'react-router'
import { Location } from 'history'
import * as Sentry from '@sentry/react'

import { IAppState } from '../../../../reducers'

import { getTeams } from '../../../../models/user/get-teams'

import * as actionsType from '../../../../constants/auth/signin'

import signin from '../../../../models/auth/signin'
import signup from '../../../../models/auth/signup'
import { lookUpUserByEmail } from '../../../../models/user/lookup-user-by-email'

import { getUserDefaultHomepage } from '../../../../utils/get-default-home-page'

import { getBrandInfo } from './get-brand-info'
import SignInForm from './SiginForm'
import LookUpUserForm from './LookupUserForm'

import { SubmitMessage } from './types'

interface Props {
  location: Location
}

export default function Signin(props: Props) {
  const dispatch = useDispatch()
  const brand = useSelector((state: IAppState) => state.brand)

  const [username, setUsername] = useState<string>(
    window.decodeURIComponent((props.location.query.username as string) || '')
  )
  const { siteLogo, siteTitle, siteColor } = getBrandInfo(brand)

  const redirectTo =
    props.location.state?.redirectTo || props.location.query?.redirectTo

  const [isLookinUp, setIsLookingUp] = useState<boolean>(false)
  const [
    lookUpFormSubmitMsg,
    setLookUpFormSubmitMsg
  ] = useState<SubmitMessage | null>(null)

  const [isLogging, setIsLogging] = useState<boolean>(false)
  const [
    signInFormSubmitMsg,
    setSignInFormSubmitMsg
  ] = useState<SubmitMessage | null>(null)
  const [isHiddenLookUpForm, setIsHiddenLookUpForm] = useState<boolean>(false)

  const handleLookUp = async ({ username }) => {
    try {
      setIsLookingUp(true)
      setLookUpFormSubmitMsg(null)

      const response = await lookUpUserByEmail(username)

      if (response.sso_url) {
        window.location.replace(response.sso_url)
      } else {
        setUsername(username)

        if (response.is_shadow) {
          await signup(username)
          setLookUpFormSubmitMsg({
            type: 'info',
            text:
              "Your email already has been signed up in Rechat. But you didn't complete the registration. We resent a new activation email. Please check your inbox."
          })
        } else if (response.password) {
          setIsHiddenLookUpForm(true)
        }

        setIsLookingUp(false)
      }
    } catch (error) {
      setIsLookingUp(false)

      if (error?.response?.body) {
        setLookUpFormSubmitMsg({
          type: 'error',
          text: error.response.body.message
        })
      }
    }
  }

  const handleSignin = async values => {
    try {
      setIsLogging(true)
      setSignInFormSubmitMsg(null)

      let user: IUser = await signin({ ...values, username })

      if (!user.teams) {
        const teams = await getTeams(user)

        user = {
          ...user,
          teams
        }
      }

      dispatch({
        user,
        type: actionsType.SIGNIN_SUCCESS
      })

      Sentry.configureScope(scope => {
        scope.setUser({
          id: user.id,
          email: user.email,
          brand: brand && {
            id: brand.id,
            name: brand.name
          }
        })
      })

      const defaultHomePage = getUserDefaultHomepage(user)

      if (redirectTo && redirectTo.includes('http')) {
        browserHistory.push('/branch?waitingForRedirect')
        window.location.href = redirectTo

        return
      }

      browserHistory.push(redirectTo || defaultHomePage)
    } catch (errorCode) {
      if (errorCode === 403) {
        setSignInFormSubmitMsg({
          type: 'error',
          text: 'Invalid resource owner credentials!'
        })
      }

      setIsLogging(false)
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
          <h1 className="c-auth__title">
            {isHiddenLookUpForm ? 'Welcome' : 'Sign In'}
          </h1>
          <p className="c-auth__subtitle">
            {isHiddenLookUpForm ? username : 'Enter your Email to continue'}
          </p>
        </header>
        <main className="c-auth__main">
          {isHiddenLookUpForm ? (
            <SignInForm
              brandColor={siteColor}
              isLoading={isLogging}
              onSubmit={handleSignin}
              submitMessage={signInFormSubmitMsg}
              handleBackToLookupForm={() => {
                setIsHiddenLookUpForm(false)
                setSignInFormSubmitMsg(null)
              }}
              username={username}
            />
          ) : (
            <LookUpUserForm
              brandColor={siteColor}
              initialValues={{ username }}
              isLoading={isLookinUp}
              onSubmit={handleLookUp}
              submitMessage={lookUpFormSubmitMsg}
            />
          )}
        </main>
      </article>
    </div>
  )
}
